var request = require('request');

var myJSONObject =  {
	"member": "rico",
	"password": "chessmaster",
	"keypad": "12345",
	"serial_num": "cpen291_b"
};
request({
    url: "http://38.88.74.79:9015/users",
    method: "POST",
    json: true,   // <--Very important!!!
    body: myJSONObject
}, function (error, response, body){

});
