  /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var result = {ipaddress: null,
              language: null,
              software: null,
             }

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.route('/api/whoami')
  .get(function(req,res){
    result = {ipaddress: null,
              language: null,
              software: null,
             }
    result.ipaddress = req.headers['x-forwarded-for'].slice(0,req.headers['x-forwarded-for'].indexOf(','));
    result.language = req.headers['accept-language'].slice(0,req.headers['accept-language'].indexOf(','));
    result.software = req.headers['user-agent'].slice(req.headers['user-agent'].indexOf('(')+1,req.headers['user-agent'].indexOf(')'));
    res.type('JSON').send(result);  
  })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Please follow this API: https://request-header-fcc-miti68.glitch.me/api/whoami/');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(3000, function () {
  console.log('Node.js listening ...');
});

