var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var sharedsession = require("express-socket.io-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
var mongo = require("./config/dbConfig")
var tokenGen = require('./routes/tokenGenration');
var usersRouter = require('./routes/users');
var auth = require('./middlewares/auth')
var scenarioUserVerify = require('./routes/scenarioUserVerify_noToken')
var Scenario = require('./routes/scenario')
var writeJson = require('./routes/writeJson')
var grouping = require('./routes/grouping')
var urlShortner = require('./routes/urlShortner')
var upload = require('./routes/upload')
var asset = require('./routes/assetmanage')
var report = require('./routes/reports')
var register = require('./routes/register')
var forgotPwd = require('./routes/forgotPwd')
var tenant = require("./routes/admin_TenantDetails")
var dashboard= require("./routes/dashboard")
var socketmodel = require('./models/socketModel')
var secretKey = require("./config/config")
var socketioJwt = require('socketio-jwt');
var clientListener = require("./config/clientListener")
var setclientdb = require("./config/setclientdb")
require('dotenv').config();

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');

/**
 * Appconfig module.
 * @module Appconfig
 * 
 */

/**
 * database connection in app config
 * @function startMongoDB
 * @param  {string} process.env.DB Its represent database name
 * @param  {string} host  Its represent host name
 */

app.startMongoDB = function (host) {
  mongo.initialize(process.env.DB, host, function (err, res) {
    if (err) console.log(err);
  });
};

app.use(function (req, res, next) {
  res.io = io;
  next();
})
app.use(cors());
app.options('*', cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

// app.use(express.json());



app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: false }))

// app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/'))
//app.use(express.static(__dirname + '/uploads/'))
app.use(express.static(__dirname + '/public/client/'))
app.use(express.static(__dirname + '/Netapp'))
app.use(cookieParser());
app.use(session({ secret: "Shh, its a secret!",
resave: true,saveUninitialized: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
  res.header("Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Accept, Origin, Authorization, X-Requested-With, x-auth-token");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * socket.io connection
 * @function io
 */

io.set('transports', ['polling', 'websocket'])
io.on('connection', (socket) => {
console.log("======socket===")
  console.log("Connected to Socket!!" + socket.id);
  // Receiving Todos from client
  socket.on('addWebGlReportData_server', (Todo) => {
    console.log('socketData: ' + JSON.stringify(Todo));
    socketmodel.insertDataBasedonWebGl(io, 'reports', Todo)
    // todoController.addTodo(io,Todo);
  });
  // Receiving Updated Todo from client
  socket.on('updateWebGlData', (Todo) => {
    console.log('socketData: ' + JSON.stringify(Todo));
    // todoController.updateTodo(io,Todo);
  });

  // Receiving Todo to Delete
  socket.on('deleteWebGlData', (Todo) => {
    console.log('socketData: ' + JSON.stringify(Todo));
    // todoController.deleteTodo(io,Todo);
  });
})




app.use('/', require('./routes/index'));

/**
 * To check Tenant is exists.
 * @function clientListener
 */
app.use(clientListener());

/**
 * database allocation for tenants.
 * @function setclientdb
 */
app.use(setclientdb());

/**
 * Routing for api connection.
 *  @typedef 
 */
//app.use('/', require('./routes/index'));
app.use('/tokenGen', tokenGen);
app.use('/writeJson', writeJson);
app.use('/scenarioUserVerify', scenarioUserVerify);
app.use('/users', auth,usersRouter);
app.use('/scenario',auth, Scenario)
app.use('/grouping', auth, grouping)
app.use('/urlShortner', auth, urlShortner)
app.use('/asset', auth, asset)
app.use('/tenant', auth, tenant)
app.use('/dashboard', auth, dashboard)
app.use('/uploadImg', auth, upload)
app.use('/report', report)
app.use('/register',register)
app.use('/forgotPwd',forgotPwd)
app.use(auth,express.static(__dirname + '/uploads/'))



/**
 * On production to run Index.html based on Angular build
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'))
  // res.sendFile(path.join(__dirname + '/Netapp/index.html'))
})

/**
 * catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * error handler
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



 module.exports = app;
//module.exports = { app: app, server: server };
