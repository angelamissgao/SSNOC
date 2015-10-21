var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var apiController = require('../app/apiController.js');

var expect = require('expect.js');

mongoose.connect('tingodb://'+__dirname+'/../ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("connected to tingodb");
  }
});

console.log('Running mongoose version %s', mongoose.version);

suite('apiController Test', function(){

	test('getMember test', function(done){

		var req = {};
		req.params = {};
		var res = {};

		req.params.name = "bruno";

		// api.getMember(req, res);
		apiController.getMembers(res);

		console.log('getMemberTest %j', res);

		expect('bruno').to.equal(res.data.name);

		done();
	});

});
