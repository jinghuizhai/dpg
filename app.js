var express = require("./node_modules/express")
  , http = require('http')
  , path = require('path')
  , flash = require("connect-flash")
  , router = require("./routes")
  , ejs = require('./node_modules/ejs')
  , session = require('./node_modules/express-session')
  , bodyParser = require('body-parser')
  , app = express();

app.use(flash());
app.use(session({
  resave: false,
  saveUninitialized: true,
  store:null,
  secret: 'dapigou',
  cookie: { maxAge: 60 * 1000 }
}));

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('port',3000);
app.use(express.static(path.join(__dirname, 'public')));//引用public中的文件时，不必再声明public
// app.set('trust proxy', function (ip) {
//   console.log("visited:",ip);
//   return true;
// })
// use的第一个参数是可以使用正则的

app.enable('trust proxy');

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app,session);

http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port " + app.get('port'));
});


