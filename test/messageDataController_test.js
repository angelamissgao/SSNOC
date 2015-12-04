var should = require('should'); 
var tungus = require('tungus');
var mongoose = require('mongoose');
var messageDataController = require('../app/controllers/messageDataController.js');

mongoose.connect('tingodb://'+__dirname+'/ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("connected to tingodb");
  }
});

suite('messageDataController Test', function(){

	test('addEmergencyMessage test', function(done){

		var io = {};
		io.emit = function (){};
		var req = {};
		req.params = {member_id: 2, message: 'EmergencyTest', latitude: 0, longitude: 0};

		var res = {};
		res.json = function(data){
			console.log(data);
			data.message.should.equal('EmergencyTest');
			done();
		}

		messageDataController.addEmergency(req, res, io);
	});

	test('getEmergencies test', function(done){

		var res = {};
		res.json = function(data){
			console.log(data);
			data[0].message.should.equal('HELP');
			done();
		}

		messageDataController.getEmergencies(res);
	});

});
