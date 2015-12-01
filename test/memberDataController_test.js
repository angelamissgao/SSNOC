var should = require('should'); 
var tungus = require('tungus');
var mongoose = require('mongoose');
var memberDataController = require('../app/controllers/memberDataController.js');

mongoose.connect('tingodb://'+__dirname+'/ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("connected to tingodb");
  }
});

suite('memberDataController Test', function(){

	test('getMember test', function(done){

		var req = {};
		req.params = {name:'mike'};

		var res = {};
		res.json = function(data){
			data.name.should.equal('mike');
			done();
		}

		memberDataController.getMember(req, res);
	});	

	test('getMemberById test', function(done){

		var req = {};
		req.params = {member_id:2};

		var res = {};
		res.json = function(data){
			data.name.should.equal('mike');
			done();
		}

		memberDataController.getMemberById(req, res);
	});	

});
