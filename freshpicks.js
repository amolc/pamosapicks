var express = require('express');
// var expressNunjucks = require('express-nunjucks').default;
var app = express();
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require("body-parser");
var multer = require('multer');
const upload = multer({ dest: 'uploads/' })
var routes = require('./public/api/routes.js');

var isDev = app.get('env') === 'development';

// var routes = require('./public/api/routes.js');
// app.set('views', __dirname + '/public');


// handle cors
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

app.use('/staffadmin', express.static(__dirname + '/staffadmin'));
app.use('/admin', express.static(__dirname + '/admin'));
app.use('/web', express.static(__dirname + '/web'));
app.use('/fresh', express.static(__dirname + '/fresh'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/fresh', express.static(__dirname + '/fresh'));
app.use('/angular', express.static(__dirname + '/public/angular'));
app.use('/header', express.static(__dirname + '/public/header'));
app.use('/footer', express.static(__dirname + '/public/footer'));
app.use('/', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/public/assets'));


// var njk = expressNunjucks(app, {
//     watch: isDev,
//     noCache: isDev,
//     autoescape: false,
//     tags: {
//       blockStart: '{%',
//       blockEnd: '%}',
//       commentStart: '{#',
//       commentEnd: '#}',
//       variableStart: '{$',
//       variableEnd: '$}'
//     }
//   });

// app.get('/', routes.index);
// app.get('/index.html', routes.index);
// app.get('/product.html', routes.product);
// app.get('/index2.html', routes.index2);
// app.get('/about.html', routes.about);
// app.get('/blog.html', routes.blog);
// app.get('/cart.html', routes.cart);
// app.get('/checkout.html', routes.checkout);
// app.get('/contact.html', routes.contact);
// app.get('/wishlist.html', routes.wishlist);
// app.get('/shop-details.html', routes.shop_details);
// app.get('/log-in.html', routes.log_In);
// app.get('/shop-left-sidebar.html', routes.shop_left_sidebar);

app.get("/sitemap.xml", function (req, res, next) {
    res.sendFile(__dirname + '/sitemap.xml');
  });
  app.get("/robots.txt", function (req, res, next) {
    res.sendFile(__dirname + '/robots.txt');
  });


global.appRoot = path.resolve(__dirname);
app.listen(42000);
console.log('freshpicks - server is started at port: 42000');
