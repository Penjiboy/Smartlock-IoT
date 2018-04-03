var http = require('http');
var url = require('url');
var fs = require('fs');
var tj = require('templatesjs');
var qs = require('querystring');
var express = require('express');//Importing Express
var app = express();//Getting App From Express
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8000;


console.log("listening on port 8000")


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

app.post('/',function(request,response){
    //correct password and username
    if (request.body.email === 'alex' && request.body.password === 'cpen291' && request.body.loginButton === 'Login'){   
        response.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./index.html');
        tj.setSync(page);
        response.write(page);
        response.end()

    //new account button    
    }else if(request.body.loginButton === 'Create New Account'){
        response.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./newAccount.html');
        tj.setSync(page);
        response.write(page);
        response.end()
    }

    //in the create user page
    else if(request.body.createButton === 'Create'){
        //if info is entered
        if(request.body.newEmail != '' && request.body.newPassword !== '' && request.body.lockAuth === 'cpen291'){
            //if valid
            if(request.body.newPassword === request.body.newPasswordCheck){
                response.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./login.html');
                tj.setSync(page);
                response.write(page);
                response.end()
            }else{
                response.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./newAccount.html');
                tj.setSync(page);
                response.write(page);
                response.end()
            }
        }else{
            response.writeHead(200, {'Content-Type': 'text/html'});
            var page = fs.readFileSync('./newAccount.html');
            tj.setSync(page);
            response.write(page);
            response.end()
        }    
    }
    else if (request.body.createButton === 'Already an user?'){
        response.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./login.html');
        tj.setSync(page);
        response.write(page);
        response.end()
    }
    //forgot password button
    else if(request.body.loginButton === 'Forgot Password'){
        response.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./login.html');
        tj.setSync(page);
        response.write(page);
        response.end()
    }
    //default is the login page
    else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./login.html');
        tj.setSync(page);
        response.write(page);
        response.end()
    }
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

//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/public'));
console.log("Server Running At:localhost:"+port);
var io = require('socket.io').listen(app.listen(port,"0.0.0.0"));//Telling Express+Socket.io App To Listen To Port //for remote server
//var io = require('socket.io').listen(app.listen(8080,"0.0.0.0"));//Telling Express+Socket.io App To Listen To Port // for local machine
io.sockets.on("connection",function(socket){
    socket.on("unlock",function(data){

        console.log("door unlocked by " + data)

    });

    socket.on('lockChanged', function(data) {
        if(data === 1) {
        socket.emit("piLockChanged", data);
            console.log("Door locked");
        }
        else if(data === 0) {
        socket.emit("piLockChanged", data);
            console.log("Door unlocked by web user");
        }
        else {
            console.log("Data value is " + data);
        }
    })
});

