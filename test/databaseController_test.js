var should = require('should'); 
var request = require('supertest');
var tungus = require('tungus');
var mongoose = require('mongoose');
var dataController = require('../app/dataController.js');

var expect = require('expect.js');

mongoose.connect('tingodb://'+__dirname+'/ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("connected to tingodb");
  }
});

suite('dataController Test', function(){

	test('getMember test', function(done){

		var req = {};
		req.params = {};
		var res = {};

		//req.params.name = "bruno";
	
		// getMemberFromDataController(function(req, res, result){
		// 		console.log('getMemberTest %j', result);
		// });

		
		// expect(res).to.exist;

		done();
	});	

});

function getMemberFromDataController(req, res,callback){
	dataController.getMember(req, res);
	return callback(res);
}
