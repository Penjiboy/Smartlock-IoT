
var data0,data1,data2;
function lastUser() {

}

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
    data0 = hour[0]+":"+minute[0]+":"+seconds[0];
    socket.emit("timeUpdated",data0);
    changeTime();
}  

function changeTime(){
   data1 = document.getElementById("time1").innerHTML;
   data2 = document.getElementById("time2").innerHTML;
}

function mostRecentTime(){
   document.getElementById("time1").innerHTML = data0;
}

function secondRecentTime(){
   document.getElementById("time2").innerHTML = data1;
}

function thirdRecentTime(){
   document.getElementById("time3").innerHTML = data2;
}

