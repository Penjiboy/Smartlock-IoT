
//reference https://dzone.com/articles/getting-started-with-nodejs-and-socketio

var api = require('./express-node-rest-project/api.js');
var express = require('express');//Importing Express
var app = express();//Getting App From Express
var fs = require('fs');//Importing File System Module To Access Files
var outRequest = require('request');
var cookie = require('cookie');
var templatesjs = require('templatesjs');
const port = 80;//Use this for remote server//Creating A Constant For Providing The Port
//const port = 8080;//Use this for testing local machine//Creating A Constant For Providing The Port
const apiPort = 9015;
const hostIP = '38.88.74.79'; //Use this for remote server
//const hostIP = 'localhost'; //use this for testing on local machine

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

//Routing Request : http://localhost:port/
app.get('/',function(request,response){
    //Telling Browser That The File Provided Is A HTML File
    response.writeHead(200,{"Content-Type":"text/html"});
    //Passing HTML To Browser
    response.write(fs.readFileSync("./login.html"));
    //Ending Response
    response.end();
});

//Routing Request : http://localhost:port/index
app.get('/index',function(request,response){
  //Telling Browser That The File Provided Is A HTML File
    var cookies = cookie.parse(request.headers.cookie || '');
    console.log(cookies);
    if(cookies.username === undefined) {
        response.writeHead(403, {'Content-Type': 'text/html'});
        response.write("ERROR! No proper authentication occured!");
        response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
    }
    var username = cookies.username;
    response.clearCookie('username');
  response.writeHead(200,{"Content-Type":"text/html"});
  //Passing HTML To Browser
    var fileContents = fs.readFile('./index.html', function(err,data) {
        if(err) throw err;

        templatesjs.set(data, function(err,data){
            if(err) throw err;

            templatesjs.render("name", username,"Case", function (err, data) {
                if(err) console.log("Error occured while rendering username");
                response.write(data);
                response.end();
            });
        })
    });
  //response.write(fileContents);
  //Ending Response
  //response.end();
});

//Routing to css file
app.get('/main.css', function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/css'});
    var fileContents = fs.readFileSync('./main.css', {encoding: 'utf8'});
    response.write(fileContents);
    response.end();
});

//Routing to png file
app.get('/last_user.png', function(request, response) {
    response.writeHead(200, {'Content-Type': 'image/png'});
    var image = fs.readFileSync('./last_user.png');
    response.write(image);
    response.end();
});

//Routing to functions.js file
app.get('/functions.js', function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    var fileContents = fs.readFileSync('./functions.js', {encoding: 'utf8'});
    response.write(fileContents);
    response.end();
});

//Routing to loginAuth
app.post('/loginAuth', function(request, response) {
    const options = {
        url: 'http://' + hostIP + ':' + apiPort + '/findUserForLogin',
        method: 'GET',
        form: {
            name: request.body.username
        },
        headers: {
            'Accept' : 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    console.log("Username entered is " + request.body.username);
    console.log("Password entered is " + request.body.password);

    var usersList = [];
    outRequest(options, function(err, res, body) {
        usersList = JSON.parse(body);
        console.log(usersList);

        (function () {
            //handle the case where no user was found
            if(usersList.data === undefined || usersList.data.length === 0) {
                response.writeHead(403, {'Content-Type': 'text/html'});

                //Write an html file with the appropriate response, for now just write some text
                response.write("Error! Username not found");
                response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
                response.end();
            } else if(usersList.data.length > 1) {
                response.writeHead(403, {'Content-Type': 'text/html'});

                //Write an html file with the appropriate response, for now just write some text
                response.write("Error! Too many users found with this name");
                response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
                response.end();
            } else {
                if(usersList.data[0].Password === request.body.password) {
                    //response.writeHead(200, {'Content-Type': 'text/html'});

                    //Register cookies and redirect user to home page, for now just write some text
                    response.setHeader('Set-cookie', cookie.serialize('username', usersList.data[0].Member), {
                        maxAge: 10
                    });
                    response.redirect('/index');
                    response.end();
                } else {
                    response.writeHead(403, {'Content-Type': 'text/html'});

                    //Register cookies and redirect user to home page, for now just write some text
                    response.write("Login unsuccessful. Incorrect password");
                    response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
                    response.end();
                }
            }
        })();
    });
});

//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/public'));
console.log("Server Running At:localhost:"+port);
var io = require('socket.io').listen(app.listen(port,"0.0.0.0"));//Telling Express+Socket.io App To Listen To Port //for remote server
io.sockets.on("connection",function(socket){
    console.log("Client connected");
    socket.on("unlock",function(data){

	socket.emit("lockChanged", 0);
        console.log("door unlocked by " + data)

    });

    socket.on("lock", function() {
        socket.emit("lockChanged", 1);
    });

    socket.on('lockChanged', function(data) {
        if(data === 1) {
	    socket.broadcast.emit("piLockChanged", data);
	    socket.broadcast.emit("lockChanged", data);
            console.log("Door locked by web user");
        }
        else if(data === 0) {
	    socket.broadcast.emit("piLockChanged", data);
	    socket.broadcast.emit("lockChanged", data);
            console.log("Door unlocked by web user");
        }
        else {
            console.log("Data value is " + data);
        }
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected')
    })
});
