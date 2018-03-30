const https = require("http");
const url =
  "http://38.88.74.79:9014/todos";
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    document.getElementById("api-example").innerHTML = "Banana";
  });
});
