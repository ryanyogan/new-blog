var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var url          = require('url');
var posts        = require('./routes/posts');
var ReactAsync   = require('react-async');
var mongoose     = require('mongoose');
var config       = require('./config');
var app          = express();

require('node-jsx').install({extension: '.jsx'});
var App = require('./react/App.jsx');

/**
 * Do not start the app unless the database connection is a success
 */
mongoose.connect(config.mongoDB, function() {
  app.set('views', path.join(__dirname + 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api', posts);

  /**
   * Render the initial React componets (Isomorphic rendering must include the path)
   */
  app.get('*', function(req, res) {
    var path = url.parse(req.url).pathname;
    ReactAsync.renderComponentToStringWithAsyncState(App({path:path}), function(err, markup) {
      res.send('<!DOCTYPE html>' + markup);
    });
  });

  /**
   * Catch any 404's and forward to error handler
   */
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /**
   * Print the stack trace in development mode
   */
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  /**
   * Do not print the stack trace to user in production mode
   */
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
});

module.exports = app;
