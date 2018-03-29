
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
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
app.get('/todos', function (req, res) {
    mc.query('SELECT * FROM cpen291', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos list.' });
    });
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(9014, function () {
    console.log('Node app is running on port 8080');
});
 
// allows "grunt dev" to create a development server with livereload
module.exports = app;
