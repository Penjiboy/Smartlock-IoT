var request = require('request');

var myJSONObject =  {
    "member": "jack",
    "password": "12345",
    "user_mic": null,
    "user_pic": null,
    "encoding": null,
    "serial_num": 1,
    "keypad": '9281',
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
