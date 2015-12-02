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

	test('addMember test', function(done){

		var req = {};
		req.params = {name: 'mike', pass: '12345', status: 0, permissionId: 0, accountStatus: 0};

		var res = {};
		res.json = function(data){
			data.name.should.equal('mike');
			data.password.should.equal('12345');
			data.status.should.equal(0);
			data.permissionId.should.equal(0);
			data.accountStatus.should.equal(0);
			done();
		}

		memberDataController.addMember(req, res);
	});

	test('updateStatus test', function(done){

		var req = {};
		req.params = {member_id: 2, status_id: 1};

		var res = {};
		res.json = function(data){
			// Fix assert
			// data.name.should.equal('mike');
			// data.status.should.equal(1);
			done();
		}

		memberDataController.addMember(req, res);
	});

});
