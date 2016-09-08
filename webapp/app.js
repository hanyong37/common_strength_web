'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const proxy = require('http-proxy-middleware');
const config = require('./config');

// express logger
morgan
  .token('remote-addr', function(req) {
      return req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress);
  })
  .token('date', function() {
      return new Date().toString();
  });

const app = global.app = express();
app.locals.pretty = false;

// development => dev
// test => daily
app.set('env', config.env);

// view setting
const viewPath = path.join(__dirname, config.viewPath);
app.set('views', viewPath);
nunjucks.configure(viewPath, {
  autoescape: true,
  noCache: !config.viewCache,
  express: app
});

// global view cache control
// diasble it under dev environment
// will cache the layout template only
app.set('view cache', config.viewCache);
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'public')));

// interface proxy
app.use('/api', proxy({
  target: 'http://121.40.185.123:8080', // target host
  changeOrigin: true,            // needed for virtual hosted sites
  ws: true,                      // proxy websockets
  cookieRewrite: true,
  pathRewrite: {
    '^/api/': '/'
  }
}));

// pipeline
app
  //cookie
  .use(cookieParser())
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .use(function(err, req, res, next) {
    res.json(err);
    console.error('[%s][%s] Express handle exception: [%s]', new Date(), process.pid, err);
  });

/*jshint unused:true*/
// routes
require('./routes')(app);

app.listen(config.port, function() {
  console.log(`[${new Date()}] app start : ${config.port}`);
});

process.on('uncaughtException', function(err) {
  console.error('[%s][%s] Caught exception: [%s]', new Date(), process.pid, err);
  process.exit(1);
});

module.exports = app;
