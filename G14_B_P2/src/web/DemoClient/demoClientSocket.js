var io = require('socket.io-client');
var ss = require('socket.io-stream');
var fs = require('fs');

//var socket = io.connect('http://localhost:8080/user');
var socket = io.connect('http://38.88.74.79:80/nodejsDemoServer');
var stream = ss.createStream();
var filename = 'last_user.png';

socket.on('connect', function (){
    console.log('Connected to a server\nPreparing To transfer file');
});

ss(socket).emit('profile-image', stream, {name: filename});
fs.createReadStream(filename).pipe(stream);
console.log('File transfer completed');

/*
//You can stream data from a client to server, and vice versa
ss(socket).on('file', function(stream) {
    fs.createReadStream('/path/to/file').pipe(stream);
});

ss(socket).emit('file', stream);
stream.pipe(fs.createWriteStream('file.txt'));

*/
