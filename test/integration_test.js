var should = require('should'); 
var request = require('supertest');
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

suite('REST API', function() {
	var url = 'http://localhost:2222';

	mongoose.connect('tingodb://'+__dirname+'/../ssnocdb/');

	test('Members', function() {
		request(url)
		.get('/api/ssnoc/directory')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('Specific Member', function() {
		request(url)
		.get('/api/ssnoc/member/bruno')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('Announcements', function() {
		request(url)
		.get('/api/ssnoc/annoucements')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('Messages', function() {
		request(url)
		.get('/api/ssnoc/messages')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('UpdateStatus', function() {
		request(url)
		.post('/api/ssnoc/update_status/2/0/0/1')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('addMember', function() {
		request(url)
		.get('/api/ssnoc/member/mike/12345')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('Messages', function() {
		request(url)
		.get('/api/ssnoc/messages')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('addMessage', function() {
		request(url)
		.get('/api/ssnoc/message/2/0/0/NewMessage')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('New Announcement', function() {
		request(url)
		.post('/api/ssnoc/message/2/0/0/NewAnnouncement')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('Emergency Alert', function() {
		request(url)
		.post('/api/ssnoc/messages')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});

	test('New Private Message', function() {
		request(url)
		.post('/api/ssnoc/private_message/2/0/0/3/PrivateMessage')
		.end(function(err, res) {
			if (err) {
				throw err;
			}
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
      });
	});
});

