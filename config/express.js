var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var partials = require('express-partials');
var passport = require('passport');
var session  = require('express-session');
var flash    = require('connect-flash');
var csurf    = require('csurf');


var server    = require('http').Server(express);
var io        = require('socket.io')(server);

server.listen(80);

var chat      = require('../app/socket/chat')(io);

var setting = {
  appname     : 'Zlove',
  basepath    : 'http://localhost:3000/',
  author      : 'ziczac solutions'
}

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  app.locals.local = {
    setting: setting
  }
  
  app.io = io;
  
  app.set('views', config.root + '/app/views');
  app.set('view options', {layout: true});
  app.set('view engine', 'ejs');

  app.use(partials());

  app.use(flash()); 

  // PASSPORT
  app.use(session({
    secret : "hGC3dqkk08CSrJH7",
    saveUninitialized: true,
    resave: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  // END PASSPORT

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(csurf({cookie: true}));

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  var api = glob.sync(config.root + '/app/api/*.js');
  api.forEach(function(api){
    require(api)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
