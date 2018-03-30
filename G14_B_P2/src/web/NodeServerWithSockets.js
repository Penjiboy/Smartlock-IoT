
//reference https://dzone.com/articles/getting-started-with-nodejs-and-socketio

var express = require('express');//Importing Express
var app = express();//Getting App From Express
var fs = require('fs');//Importing File System Module To Access Files
const port = 80;//Creating A Constant For Providing The Port

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

//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/public'));
console.log("Server Running At:localhost:"+port);
//var io = require('socket.io').listen(app.listen(port,"0.0.0.0"));//Telling Express+Socket.io App To Listen To Port //for remote server
var io = require('socket.io').listen(app.listen(8080,"0.0.0.0"));//Telling Express+Socket.io App To Listen To Port // for local machine
io.sockets.on("connection",function(socket){
    console.log("Client connected");
    socket.on("unlock",function(data){

        console.log("door unlocked by " + data)

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
