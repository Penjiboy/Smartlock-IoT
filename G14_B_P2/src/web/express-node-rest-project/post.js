var request = require('request');

var myJSONObject =  {
	"member": "rico",
	"password": "chessmaster",
	"id":11
};
request({
    url: "http://38.88.74.79:9015/users",
    method: "PUT",
    json: true,   // <--Very important!!!
    body: myJSONObject
}, function (error, response, body){

});
