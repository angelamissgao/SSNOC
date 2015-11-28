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
		req.params.name = "mike";
		
		//Fix
		// var response = dataController.getMember(req, res);

		 //console.log("Get member : " + response);
		 //expect(response).to.be();
		 console.log("Req " + req.params.name);


		// dataController.getMember(req, res);

		 getMemberFromDataController(req, res, function(err,result){
		  		console.log('getMemberTest ' +  result);
		 });

		// var response = dataController.getMember(req, res);
		// expect(res).to.exist;

		done();
	});	

});

// suite('file controller test', function(){
// 	test('upload file', function(done){
// 		var file = "test file";
// 		var filename = "testFile.txt";
// 		var response = 	fileUploadController.customFileWriter(file, filename);
// 		expect(response).to.be("uploadImages/" + filename);
// 		done();
// 	});
// });

function getMemberFromDataController(req, res, callback){
	 return callback(dataController.getMember(req, res));
}
