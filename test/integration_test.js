var should = require('should'); 
var request = require('supertest');
var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var apiController = require('../app/apiController.js');

var expect = require('expect.js');

mongoose.connect('tingodb://'+__dirname+'/ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("connected to tingodb");
  }
});

console.log('Running mongoose version %s', mongoose.version);

suite('REST API', function() {
	var server = require('../main');

	var url = 'http://localhost:2222';

	mongoose.connect('tingodb://'+__dirname+'/ssnocdb/');

	test('Members', function(done) {
		request(url)
		.get('/api/ssnoc/directory')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

		  // FIX assert
          // res.should.have.status(400);
          // res.body.status.should.equal('1');
          // parseFloat(res.body.status).should.equal(1);
          // console.log('getMemberTest response');
          // console.log('getMemberTest res', res.body.status);
          // console.log('04');

          done();
      });
	});


	test('Specific Member', function(done) {
		request(url)
		.get('/api/ssnoc/member/bruno')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          done();
      });
	});

	test('Announcements', function(done) {
		request(url)
		.get('/api/ssnoc/annoucements')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('Messages', function(done) {
		request(url)
		.get('/api/ssnoc/messages')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('UpdateStatus', function(done) {
		request(url)
		.post('/api/ssnoc/update_status/2/0/0/1')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('addMember', function(done) {
		request(url)
		.post('/api/ssnoc/member/mike/12345')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('Messages', function(done) {
		request(url)
		.get('/api/ssnoc/messages')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('addMessage', function(done) {
		request(url)
		.get('/api/ssnoc/message/2/0/0/NewMessage')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('New Announcement', function(done) {
		request(url)
		.post('/api/ssnoc/message/2/0/0/NewAnnouncement')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	});

	test('New Private Message', function(done) {
		request(url)
		.post('/api/ssnoc/private_message/2/0/0/3/PrivateMessage')
		.end(function(err, res) {
			if (err) {
				throw err;
			}

          // res.should.have.status(200);
          done();
      });
	
	});  

});

