
//reference https://dzone.com/articles/getting-started-with-nodejs-and-socketio

var api = require('./express-node-rest-project/api.js');
var express = require('express'); //Importing Express
var app = express(); //Getting App From Express
var fs = require('fs'); //Importing File System Module To Access Files
var outRequest = require('request'); //Importing request module to send requests
var cookie = require('cookie'); //Importing cookie module to access/manipulate browser cookies
var templatesjs = require('templatesjs'); //Importing
const port = 80; //Use this for remote server//Creating A Constant For Providing The Port
//const port = 8080; //Use this for testing local machine//Creating A Constant For Providing The Port
const apiPort = 9015;
const hostIP = '38.88.74.79'; //Use this for remote server
//const hostIP = 'localhost'; //use this for testing on local machine
var crypto = require("crypto"); //for encryption 
var key = 'calmdown!'; //for encryption 
var usersPasscode = undefined; //for keeping track of a users passcode
const bodyParser = require('body-parser'); //for parsing incoming request bodies into json
app.use(bodyParser.urlencoded({
    extended: true
}));

//encrytion function, reference http://www.codeblocq.com/2016/06/DES-encryption-in-Node-and-JavaScript/ 
function encodeDesECB(textToEncode, keyString) {
    var key = new Buffer(keyString.substring(0, 8), 'utf8');
    var cipher = crypto.createCipheriv('des-ecb', key, '');
    var c = cipher.update(textToEncode, 'utf8', 'base64');
    c += cipher.final('base64');
    return c;
}

//Routing Request : http://localhost:port/
app.get('/',function(request,response){
    //Telling Browser That The File Provided Is A HTML File
    response.writeHead(200,{"Content-Type":"text/html"});
    //Passing HTML To Browser
    response.write(fs.readFileSync("./login.html"));
    //Ending Response
    response.end();
});

//Routing request : http://localhost:port/newAccount.html
app.get('/newAccount.html', function(request,response) {
    //Serving the new account page
    response.writeHead(200, {"Content-Type":"text/html"});
    response.write(fs.readFileSync("./newAccount.html"));
    response.end()
});

//Routing Request : http://localhost:port/index
app.get('/index',function(request,response){
    //Parse browser cookies
    var cookies = cookie.parse(request.headers.cookie || '');
    console.log(cookies);

    var username = cookies.username;
    //initialize the pin name cookie
    response.setHeader('Set-cookie', cookie.serialize('pinname', username), {
        maxAge: 10
    });

    //read the file contents of index.html so that we can set the templatized variables
    var fileContents = fs.readFile('./index.html', function(err,data) {
        if(err) throw err;

        //prepare the data for rendering specific variabls
        templatesjs.set(data, function(err,data){
            if(err) throw err;
	        response.clearCookie('username');
	        console.log('username is ' + username);

	        //Render name variable
            templatesjs.render("name", username,"Case", function (err, data) {
                if(err) console.log("Error occurred while rendering username");
                var finalAudioFilePath = "<source src=\"" + cookies.audioFilePath + "/myMessage.wav\" type=\"audio/wav\">";
                //render the audio file path variable so that the html file knows which path to look for the audio file
                templatesjs.render("audioFilePath", finalAudioFilePath, function (err, data) {
                    if(err) console.log("Error occurred while rendering audio file path");
                    response.writeHead(200, {'Content-Type':'text/html'});
                    //write the templatized html file into the response
		            response.write(data);
                    response.end();
                });
            });
        })
    });
});

//Routing to css file
app.get('/main.css', function(request, response) {
    //serve the css file
    response.writeHead(200, {'Content-Type': 'text/css'});
    var fileContents = fs.readFileSync('./main.css', {encoding: 'utf8'});
    response.write(fileContents);
    response.end();
});

//Routing to audio files
app.get('/mic/lock1/myMessage.wav', function(request, response) {
    //serve the audio file
    response.writeHead(200, {'Content-Type': 'audio/wav'});
    var fileContents = fs.readFileSync('mic/lock1/myMessage.wav');
    response.write(fileContents);
    response.end();
});

app.get('/mic/lock2/myMessage.wav', function(request, response) {
    //serve the audio file
    response.writeHead(200, {'Content-Type': 'audio/wav'});
    var fileContents = fs.readFileSync('mic/lock2/myMessage.wav');
    response.write(fileContents);
    response.end();
});

//Routing to png file
app.get('/last_user.jpg', function(request, response) {
    //serve the png file
    response.writeHead(200, {'Content-Type': 'image/jpg'});
    var image = fs.readFileSync('./last_user.jpg');
    response.write(image);
    response.end();
});

//Routing to new png file
app.get('/home/lock/last/last_user.jpg', function(request, response) {
    //serve the png file
    response.writeHead(200, {'Content-Type': 'image/jpg'});
    var image = fs.readFileSync('/home/lock/last/last_user.jpg');
    response.write(image);
    response.end();
});

//Routing to functions.js file
app.get('/functions.js', function(request, response) {
    //serve the functions.js file
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    var fileContents = fs.readFileSync('./functions.js', {encoding: 'utf8'});
    response.write(fileContents);
    response.end();
});

//Routing to newAcc
app.post('/newAcc', function(request, response) {
    //Handle the data sent from create a new account page
    //If passwords are not equal, return an error message
    if(request.body.password !== request.body.confirmPassword) {
        response.writeHead(403, {'Content-Type': 'text/html'});

        //Write an html file with the appropriate response, for now just write some text
        response.write("Error! Passwords do not match");
        response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
        response.end();
    }

    //setup the options for sending a request to the api for posting a new user to the database
    const newAccOptions = {
        url: 'http://' + hostIP + ':' + apiPort + '/users',
        method: 'POST',
        form: {
            member: request.body.member,
            password: request.body.password,
            keypad: request.body.keypad,
            serial_num: request.body.serial_num
        },
        headers: {
            'Accept' : 'text/html',
            'Accept-Charset': 'utf-8'
        }
    };

    //setup the options for sending a request to the api for finding a user in the database
    const checkUserExistsOptions = {
        url: 'http://' + hostIP + ':' + apiPort + '/findUserForLogin',
        method: 'GET',
        form: {
            name: request.body.member
        },
        headers: {
            'Accept' : 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    var usersList = [];
    //check if a user with the input name already exists in the database. If so, return an error message
    outRequest(checkUserExistsOptions, function(err, res, body) {
        usersList = JSON.parse(body);
        if(usersList.data.length > 0) {
            response.writeHead(403, {'Content-Type': 'text/html'});

            //Write an html file with the appropriate response, for now just write some text
            response.write("Error! Username already exists!");
            response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
            response.end();
        }
        else {
            //redirect to the login page --Not functional probably because we're redirecting in the inner request,
            // but should instead redirect in the outer request
            outRequest2(newAccOptions, function(err, res, body) {
            response.redirect('/');
		    response.end();
            })
        }
    });

});

//Routing to loginAuth
app.post('/loginAuth', function(request, response) {
    //Handle the data sent from a user logging in
    //Prepare the options for sending a request to the api for checking if a user exists
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

                //Write an html file with the appropriate response
                response.write("Error! Username not found");
                response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
                response.end();
            } else if(usersList.data.length > 1) {
                response.writeHead(403, {'Content-Type': 'text/html'});

                //Write an html file with the appropriate response
                response.write("Error! Too many users found with this name");
                response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
                response.end();
            } else {
                if(usersList.data[0].Password === request.body.password) {
                    //Register cookies and redirect user to home page, for now just write some text
                    response.setHeader('Set-cookie', cookie.serialize('username', usersList.data[0].Member), {
                        maxAge: 10000
                    });
                    response.setHeader('Set-cookie', cookie.serialize('audioFilePath', usersList.data[0].encoding), {
                        maxAge: 10
                    });
                    usersPasscode = usersList.data[0].keypad;
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

//Routing to pinChange
//need to figure out how to check the pin for the specific user!! 
app.post('/pinChange', function(request,response) {
    var cookies = cookie.parse(request.headers.cookie || '');
    console.log(cookies);
    if(cookies.pinname === undefined) {
        response.writeHead(403, {'Content-Type': 'text/html'});
        response.write("ERROR! No pin was found!");
        response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Try logging in again</a>");
        response.end();
    }
    var pinname = cookies.pinname; 
    const options = {
        url: 'http://' + hostIP + ':' + apiPort + '/findUserForLogin',
        method: 'GET',
        form:{
            name: pinname
        },
        headers: {
            'Accept' : 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    console.log("New Pin entered is "  + request.body.newpin);
    
    //var npin = encodeDesECB(request.body.newpin, key);
    outRequest(options, function(err, res, body) {
        pin = JSON.parse(body);
        console.log(pin);
        (function () {
            //button pressed but there is an error retrieving the user
            if(pin.data === undefined || pin.data.length === 0) {
                response.writeHead(403, {'Content-Type': 'text/html'});
                //Write an html file with the appropriate response, for now just write some text
                response.write("Error! No pin found!");
                response.write("<br/><a href=\"http://"+hostIP+":"+port+"\">Error retrieving the user, please relogin</a>");
                response.end();
            } else {
                    //make sure that the newpin is a valid number sequence 
                    if(!isNaN(request.body.newpin)){
                        
                        //create a json object which holds the data, with keypad being changed 
                        var pinJSONOBJECT = {
                            "member": pin.data[0].Member,
                            "password": pin.data[0].Password,
                            "user_mic": pin.data[0].user_mic,
                            "user_pic": pin.data[0].user_pic,
                            "encoding": pin.data[0].encoding,
                            "serial_num": pin.data[0].serial_num,
                            "keypad": request.body.newpin,
                            "time": pin.data[0].time,
                            "id":pin.data[0].id
                        };

                        //modify the keypad data according to the id # 
                        request({
                            url: "http://38.88.74.79:9015/users",
                            method: "PUT",
                            json: true,   // <--Very important!!!
                            body: myJSONObject
                        }, function (error, response, body){});
                        response.writeHead(403, {'Content-Type': 'text/html'});
                        response.write("Pin Change Successful.")
                	    response.write("<br/><a href=\"http://"+hostIP+"/index"+"\">Go back to home page.</a>");
                        response.end();
                    }
                    else{
                        response.writeHead(403, {'Content-Type': 'text/html'});
                        response.write("Pin Change Unsuccessful. Invalid new pin.");
			            response.write("<br/><a href=\"http://"+hostIP+"/index"+"\">Go back to home page.</a>");
                        response.end();
                    }
                } 
        })();
    });
});

//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/public'));
console.log("Server Running At:localhost:"+port);
var io = require('socket.io').listen(app.listen(port,"0.0.0.0"));//Telling Express+Socket.io App To Listen on specified Port
io.sockets.on("connection",function(socket){
    console.log("Client connected");

    //listen for 'unlock' signal and do the following actions
    socket.on("unlock",function(data){
        //send a 'lock changed' signal with the value 0
        socket.emit("lockChanged", 0);
            console.log("door unlocked by " + data)
    });

    //listen for 'lock' signal and do the following actions
    socket.on("lock", function() {
        socket.emit("lockChanged", 1);
    });

    //listen for 'login' signal and do the following actions
    socket.on('login', function(data) {
        var userInfo = JSON.parse(data);
        console.log(userInfo.member + " Trying to log in");

        const options = {
            url: 'http://' + hostIP + ':' + port + '/loginAuth',
            method: 'POST',
            form: {
                username: userInfo.member,
		password: userInfo.password
            },
            headers: {
                'Accept' : 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };

        outRequest(options, function(err, res, body) {
	    console.log(res);
	    console.log(res.status);
            if(res.statusCode === 302) {
                socket.emit('loginSuccesful', usersPasscode);
                usersPasscode = undefined;
            }
            else {
                socket.emit('loginUnsuccesful', {});
                socket.disconnect();
            }
        });


    });

    //listen for 'timeUpdated' signal and do the following actions
    socket.on('timeUpdated', function(data) {
        socket.broadcast.emit("updateTime", data);
    });

    //listen for 'lockChanged' signal and do the following actions
    socket.on('lockChanged', function(data) {
        if(data === 1) {
            //Send appropriate signals to all listening/connected clients
	        socket.broadcast.emit("piLockChanged", data);
	        socket.broadcast.emit("lockChanged", data);
            console.log("Door locked by web user");
        }
        else if(data === 0) {
            //Send appropriate signals to all listening/connected clients
	        socket.broadcast.emit("piLockChanged", data);
	        socket.broadcast.emit("lockChanged", data);
            console.log("Door unlocked by web user");
        }
        else {
            console.log("Data value is " + data);
        }

        socket.broadcast.emit('train');
    });

    //listen for 'timeUpdated' signal and broadcast it to all connected clients so that the history table can be updated
     socket.on('timeUpdated', function(data) {
        socket.broadcast.emit("updateTime", data);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected')
    })
});
