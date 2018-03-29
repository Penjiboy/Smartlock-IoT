var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(http);
var tj = require('templatesjs');

http.createServer(handler).listen(80, "0.0.0.0");

function handler(req, res) {
    if(req.url === '/main.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        var fileContents = fs.readFileSync('./main.css', {encoding: 'utf8'});
        res.write(fileContents);
        res.end();
    }
    else if(req.url === '/last_user.png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        var image = fs.readFileSync('./last_user.png')
        res.write(image);
        res.end();
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./index.html');
        tj.setSync(page);
        res.write(page);
        res.end()
    }
}

io.on('connection', function (socket) {

total++;
console.log(total, 'sockets connected')

  socket.on('unlock', function () {
    console.log("completed");
    socket.emit("bbb");
  });

    socket.on('disconnect',function(){
console.log('disconnected')
    total--;
    });

});
