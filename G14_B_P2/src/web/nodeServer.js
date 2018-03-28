var http = require('http');
var url = require('url');
var fs = require('fs');
var tj = require('templatesjs');
var qs = require('querystring');

//http.createServer(handler).listen(80, "0.0.0.0"); //for remote server
http.createServer(handler).listen(8080);

function handler(req, res) {
    switch(req.url) {
        case '/main.css':
            res.writeHead(200, {'Content-Type': 'text/css'});
            var fileContents = fs.readFileSync('./main.css', {encoding: 'utf8'});
            res.write(fileContents);
            res.end();
            break;
        case '/last_user.png':
            res.writeHead(200, {'Content-Type': 'image/png'});
            var image = fs.readFileSync('./last_user.png');
            res.write(image);
            res.end();
            break;
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            var page = fs.readFileSync('./login.html');
            res.write(page);
            res.end();
            break;
        case '/loginAuth':
            handleLogin(req, res);

            break;
        default:
            res.writeHead(404, {'Content-Typ': 'text/html'});
            res.write("Error! Page not found");
            res.end();
    }
    /*
    if(req.url === '/main.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        var fileContents = fs.readFileSync('./main.css', {encoding: 'utf8'});
        res.write(fileContents);
        res.end();
    }
    else if(req.url === '/last_user.png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        var image = fs.readFileSync('./last_user.png');
        res.write(image);
        res.end();
    }
    else if(req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./login.html');
        res.write(page);
        res.end();
    }
    */

    /*
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var page = fs.readFileSync('./index.html');
        tj.setSync(page);
        res.write(page);
        res.end()
    }
    */
}

function handleLogin(request, response) {
    //check if it's the right method
    if(request.method !== 'POST') {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("Error occurred! Incorrect request method");
        response.end();
    }

    var body = '';

    request.on('data', function(data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });

    var post = qs.parse(body);
    var username = post[username];
    var password = post[password];
    console.log(post);
    console.log("Username is " + username);
    console.log("Passowrd is " + password);

}
