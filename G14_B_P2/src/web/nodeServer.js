var http = require('http');
var url = require('url');
var fs = require('fs');
var tj = require('templatesjs');

http.createServer(handler).listen(8080);

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
