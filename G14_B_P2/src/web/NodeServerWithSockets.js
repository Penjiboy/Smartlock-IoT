
//reference https://dzone.com/articles/getting-started-with-nodejs-and-socketio

var api = require('./express-node-rest-project/api.js');
var express = require('express');//Importing Express
var app = express();//Getting App From Express
var fs = require('fs');//Importing File System Module To Access Files
var outRequest = require('request');
//const port = 80;//Use this for remote server//Creating A Constant For Providing The Port
const port = 8080;//Use this for testing local machine//Creating A Constant For Providing The Port

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

//Routing Request : http://localhost:port/
app.get('/',function(request,response){
    //Telling Browser That The File Provided Is A HTML File
    response.writeHead(200,{"Content-Type":"text/html"});
    //Passing HTML To Browser
    //response.write(fs.readFileSync("./public/index.html")); //for remote server
    response.write(fs.readFileSync("./login.html"));
    //response.write(fs.readFileSync('./index.html')); // for local machine
    //Ending Response
    response.end();
});

//Routing Request : http://localhost:port/index
app.get('/index',function(request,response){
  //Telling Browser That The File Provided Is A HTML File
  response.writeHead(200,{"Content-Type":"text/html"});
  //Passing HTML To Browser
  //response.write(fs.readFileSync("./public/index.html")); //for remote server
  response.write(fs.readFileSync("./index.html"));
  //response.write(fs.readFileSync('./index.html')); // for local machine
  //Ending Response
  response.end();
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
        url: 'http://localhost:9014/findUserForLogin',
        method: 'GET',
        form: {
            name: request.body.username
        },
        headers: {
            'Accept' : 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    console.log("Username is " + request.body.username);

    var usersList = [];
    outRequest(options, function(err, res, body) {
        usersList = JSON.parse(body);
        console.log(usersList);
    });

    //handle the case where no user was found
    if(usersList.data.isEmptyObject()) {
        response.writeHead(200, {'Content-Type': 'text/html'});

        //Write an html file with the appropriate response, for now just write some text
        response.write("Error! Username not found")._end();
    }


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
	console.log("data value is: " + data);
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
    })
});
