var http = require('http');
var url = require('url');
var fs = require('fs');
var tj = require('templatesjs');
var qs = require('querystring');

http.createServer(handler).listen(8000, "0.0.0.0");

console.log("listening on port 8000")

var dict = [];


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
    //otherwise show login page
    else{
        console.log(req.url)
        var body = '';
        req.on('data', function(chunk) {
          body += chunk;
        });
        req.on('end', function() {
          data = qs.parse(body);
          console.log(data)
        
            //correct password and username
            if (data.email === 'alex' && data.password === 'cpen291' && req.method === 'POST' && data.loginButton === 'Login'){   
                username = data.email;
                console.log(username);
                res.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./index.html');
                tj.setSync(page);
                res.write(page);
                res.end()

            //new account button    
            }else if(data.loginButton === 'Create New Account'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./newAccount.html');
                tj.setSync(page);
                res.write(page);
                res.end()
            }

            //in the create user page
            else if(data.createButton === 'Create'){
                //if info is entered
                if(data.newEmail != '' && data.newPassword !== '' && data.lockAuth === 'cpen291'){
                    //if valid
                    if(data.newPassword === data.newPasswordCheck){
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        var page = fs.readFileSync('./login.html');
                        tj.setSync(page);
                        res.write(page);
                        res.end()
                    }else{
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        var page = fs.readFileSync('./newAccount.html');
                        tj.setSync(page);
                        res.write(page);
                        res.end()
                    }
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    var page = fs.readFileSync('./newAccount.html');
                    tj.setSync(page);
                    res.write(page);
                    res.end()
                }    
            }
            else if (data.createButton === 'Already an user?'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./login.html');
                tj.setSync(page);
                res.write(page);
                res.end()
            }
            //forgot password button
            else if(data.loginButton === 'Forgot Password'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./index.html');
                tj.setSync(page);
                res.write(page);
                res.end()
            }
            //default is the login page
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                var page = fs.readFileSync('./login.html');
                tj.setSync(page);
                res.write(page);
                res.end()
            }
        });   
             
    }
}