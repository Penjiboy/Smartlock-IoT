
/*
EXAMPLE OF GET REQUEST
TO GET OUTPUT RUN
  node functions.js on command line


const https = require("http");
const url =
  "http://38.88.74.79:9014/users";
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(body);
    //document.getElementById("api-example").innerHTML = "Banana";
  });
});
*/


function lockUnlock(){
   
   if(!document.getElementById("lockStatus").checked){
       alert("CONFIRM UNLOCK. The lock will auto-lock after 5 seconds.");
       timeUpdate();
       setTimeout("lockLock()",5000)
   }
  
}


function lockLock(){
    // var socket = io(38.88.74.79);
     socket.emit("lockChanged", 1);
      document.getElementById("lockStatus").checked = true;
}


var hour = new Array();
var minute = new Array();
var seconds = new Array();
for(i=0;i<3;i++){
    hour[i] = 0;
    minute[i] = 0;
    seconds[i] = 0;
}

function timeUpdate(){
    var now=new Date();
    for(i=1;i>=0;i--){
        hour[i+1] = hour[i];
        minute[i+1] = minute[i];
        seconds[i+1] = seconds[i];
    }
    hour[0] = now.getHours();
    minute[0] = now.getMinutes();
    seconds[0] = now.getSeconds(); 
}  

function mostRecentTime(){
   document.getElementById("time1").innerHTML = (hour[0]+":"+minute[0]+":"+seconds[0]);
}

function secondRecentTime(){
   document.getElementById("time2").innerHTML = (hour[1]+":"+minute[1]+":"+seconds[1]);
}

function thirdRecentTime(){
   document.getElementById("time3").innerHTML = (hour[2]+":"+minute[2]+":"+seconds[2]);
}
