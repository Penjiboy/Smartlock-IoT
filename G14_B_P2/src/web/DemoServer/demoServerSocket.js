var io = require('socket.io').listen(8080);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');


io.of('user').on('connection', function(socket) {
    console.log('Client connected');
    ss(socket).on('profile-image', function(stream, data) {
        console.log('Preparing to transfer a file');
        var filename = path.basename(data.name);
        stream.pipe(fs.createWriteStream(filename));
        console.log('File Transfer completed');
    });
});

// createStream() returns a new stream which can be sent by emit()