var express = require('express');
var morgan= require('morgan');
var logger= require ('./logger') ;
var glob= require('glob');
var mongoose= require('mongoose');
var bluebird= require('bluebird');
var http = require("http");


var app = express();

app.use(function(req, res, next){
  console.log('Request from ' + req.ip);
  next();
});

app.get('/',function(req,res){
	res.send('Hello World!');
});

http.createServer(app).listen(5000, function(){
	console.log('Express server listening on port ' + 3000);
});

var express = require('express');

module.exports = function (app, config) {
    logger.log("Loading Mongoose functionality");
    mongoose.Promise = require('bluebird');
    mongoose.connect(config.db, {useMongoClient: true});
    var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });
  
    if(process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    	mongoose.set('debug', true);
        mongoose.connection.once('open', function callback () {
            logger.log("Mongoose connected to the database");
        });
    	app.use(function (req, res, next) {
        logger.log('Request from ' + req.connection.remoteAddress, 'info');
        next();
        });
    }
    app.use(morgan('dev'));
    

  app.use(function (req, res, next) {
    console.log('Request from ' + req.connection.remoteAddress);
    next();
  });  
  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller);
  });

  app.use(express.static(config.root + '/public'));
  
    app.use(function (req, res) {
      res.type('text/plan');
      res.status(404);
      res.send('404 Not Found');
    });
  
    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.type('text/plan');
      res.status(500);
      res.send('500 Sever Error');
    });
  
    console.log("Starting application");
  
  };
  