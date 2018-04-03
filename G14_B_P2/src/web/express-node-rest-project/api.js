const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = 9015;
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root', //for remote server
    //user: 'cpen291', //for local machine testing
    password: 'cpen291',
    database: 'cpen291'
});
 
// connect to database
mc.connect();
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
// Retrieve all todos 
app.get('/users', function (req, res) {
    mc.query('SELECT * FROM cpen291', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos list.' });
    });
});

//find a particular user
app.get('/findUserForLogin', function (req, res) {
    mc.query('SELECT Member, Password FROM cpen291 where Member=\'' + req.body.name +'\'', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Matching user' });
    });
});


app.post('/users', function (req, res) {
    console.log(req.body);
    var encoding = {
        cpen291_a: "mic/lock1",
        cpen291_b: "mic/lock2",
        cpen291_c: "mic/lock3"
    };

    var enc = encoding[req.body.serial_num]
    console.log(enc);

    var data = {
        "Member": req.body.member,
        "Password": req.body.password,
        "user_mic": req.body.user_mic,
        "user_pic": req.body.user_pic,
        "keypad": req.body.keypad,
        "encoding": enc,
        "serial_num": req.body.serial_num
     };
 
    
 
    mc.query("INSERT INTO cpen291 SET ? ", data, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New task has been created successfully.' });
    });
});

app.put('/users', function (req, res) {
    
    console.log(req.body);

    var encoding = {
        cpen291_a: "mic/lock1",
        cpen291_b: "mic/lock2",
        cpen291_c: "mic/lock3"
    };

    var data = {
        "Member": req.body.member,
        "Password": req.body.password,
        "user_mic": req.body.user_mic,
        "user_pic": req.body.user_pic,
        "keypad": req.body.keypad,
        "encoding": encoding[req.body.serial_num],
        "serial_num": req.body.serial_num
     };
 
    mc.query('UPDATE cpen291 SET ? WHERE id =' + req.body.id, data, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });
});


// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(port, function () {
    console.log('Rest api listening on port ' + port);
});
 
// allows "grunt dev" to create a development server with livereload
module.exports = app;
