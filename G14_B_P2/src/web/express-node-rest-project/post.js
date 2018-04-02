var request = require('request');
var x = '8902'
var myJSONObject =  {
    "member": "jhou",
    "password": "password",
    "user_mic": null,
    "user_pic": null,
    "encoding": null,
    "serial_num": 1200,
    "keypad": x,
    "time": null,
	"id":12
};
request({
    url: "http://38.88.74.79:9015/users",
    method: "PUT",
    json: true,   // <--Very important!!!
    body: myJSONObject
}, function (error, response, body){

});
