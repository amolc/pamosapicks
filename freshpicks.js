var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Credentials", false);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb", extended: true, type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, type: "application/x-www-form-urlencoding" }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ limit: "50mb" }));


app.use('/admin', express.static(__dirname + '/admin'));
app.use('/', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/public/assets'));

app.get("/sitemap.xml", function (req, res, next) {
  res.sendFile(__dirname + '/sitemap.xml');
});
app.get("/robots.txt", function (req, res, next) {
  res.sendFile(__dirname + '/robots.txt');
});

global.appRoot = path.resolve(__dirname);
app.listen(42000);
console.log('Freshpicks - server is started at port: 42000');
