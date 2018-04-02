/*var crypto = require("crypto");
var key = "calmdown!";
var pin = "12345"
var enc = crypto.createCipher("des-ecb",key, '').update(pin,"utf-8","hex");

console.log(enc);*/

/*var crypto = require("crypto");
var plaintext = new Buffer( '675A69675E5A6B5A', 'hex' ).toString( 'binary' );
console.log("plain:"+plaintext);
var key = new Buffer( '5B5A57676A56676E', 'hex' );
var iv = new Buffer(8);
iv.fill(0);
var cipher = crypto.createCipheriv("des", key, iv);
cipher.setAutoPadding(false);
var c = cipher.update( plaintext, 'binary', 'hex' );
c+=cipher.final('hex' );
console.log(c);*/

var crypto = require("crypto");
function encodeDesECB(textToEncode, keyString) {
    var key = new Buffer(keyString.substring(0, 8), 'utf8');
    var cipher = crypto.createCipheriv('des-ecb', key, '');
    var c = cipher.update(textToEncode, 'utf8', 'base64');
    c += cipher.final('base64');
    return c;
  }

  var pin = '12345';
  var key = 'calmdown!';
  var x = encodeDesECB(pin,key);
  console.log(x);