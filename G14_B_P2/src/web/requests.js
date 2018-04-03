var querystring = require('querystring');
var http = require("http");
//var url = "http://38.88.74.79:9014/users";
const postData = querystring.stringify({
  'pedro': '12345'
});

const options = {
  hostname: '38.88.74.79',
  port: 9014,
  path: '/users',
  method: 'POST',
  headers: {
    'pedro': "12345"
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();