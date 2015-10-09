// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var port  	 = process.env.PORT || 2222; 				// set the port		// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//test Socketio
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var Promise = require('promise');
// var promise = Promise.resolve(3);


// configuration ===============================================================
mongoose.connect('tingodb://'+__dirname+'/ssnocdb/'); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================

// require('./app/base')(io);

// listen (start app with node server.js) ======================================
// app.listen(port);
// console.log("App listening on port " + port);


http.listen(port, function(){
  console.log('listening on' + port);
});

//  io.on('connection', function(socket){
//      console.log('a user connected');

// //     io.emit('chat message',tweet);
// //     console.log('a user connected');
//   });


require('./app/apiController.js')(app, io);
