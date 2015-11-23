var should = require('should'); 
var request = require('supertest');
var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var apiController = require('../app/apiController.js');

var expect = require('expect.js');

// var fs = require('fs');

// var dbPath = './ssnocdb/messages';

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

	// after(function(){
	// 	fs.unlinkSync(dbPath);
	// });

	mongoose.connect('tingodb://'+__dirname+'/ssnocdb/');

	test('addMember', function(done) {
		request(url)
		.post('/api/ssnoc/member/mike/12345')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
		var result = JSON.parse(res.text);

		result.name.should.be.equal('mike');
		result.password.should.be.equal('12345');
		result.status.should.be.equal(0);

        done();
      });
	});

	test('addMessage', function(done) {
		request(url)
		.post('/api/ssnoc/message/2/0/0/NewMessage')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

		var result = JSON.parse(res.text);

		result.message.should.be.equal('NewMessage');
		result.member_id.should.be.equal(2);
		result.position.lat.should.be.equal(0);
		result.position.lng.should.be.equal(0);

          done();
      });
	});

	test('Add Announcement', function(done) {
		request(url)
		.post('/api/ssnoc/message/2/0/0/NewAnnouncement')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			var result = JSON.parse(res.text);

			result.message.should.be.equal('NewAnnouncement');
			result.member_id.should.be.equal(2);
			result.position.lat.should.be.equal(0);
			result.position.lng.should.be.equal(0);

          done();
      });
	});

	test('Add Private Message', function(done) {
		request(url)
		.post('/api/ssnoc/private_message/2/0/0/3/PrivateMessage')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			var result = JSON.parse(res.text);

			result.message.should.be.equal('PrivateMessage');
			result.member_id.should.be.equal(2);
			result.receiver_id.should.be.equal(3);
			result.position.lat.should.be.equal(0);
			result.position.lng.should.be.equal(0);

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

			var result = JSON.parse(res.text);

			// console.log('response: %j', result);
			result.message.should.be.equal("Status updated: Member 2 status is 1and location is 0 ; 0");

          	done();
      });
	});

	test('Members', function(done) {
		request(url)
		.get('/api/ssnoc/directory')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

		var result = JSON.parse(res.text);

		result[0].name.should.be.equal('mike');
		result[0].password.should.be.equal('12345');
		result[0].status.should.be.equal(1);

        done();
      });
	});


	test('Specific Member', function(done) {
		request(url)
		.get('/api/ssnoc/member/mike')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

   		  var result = JSON.parse(res.text);

		  result.name.should.be.equal('mike');
		  result.password.should.be.equal('12345');
		  result.status.should.be.equal(1);

          done();
      });
	});

/*	test('Announcements', function(done) {
		request(url)
		.get('/api/ssnoc/annoucements')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			// var result = JSON.parse(res.text);

			console.log("test %j", res);

			// result[0].message.should.be.equal('NewMessage');
			// result[0].member_id.should.be.equal(2);
			// result[0].position.lat.should.be.equal(0);
			// result[0].position.lng.should.be.equal(0);

          done();
      });
	});
*/
	test('Messages', function(done) {
		request(url)
		.get('/api/ssnoc/messages')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			var result = JSON.parse(res.text);

			result[0].message.should.be.equal('NewAnnouncement');
			result[0].member_id.should.be.equal(2);
			result[0].position.lat.should.be.equal(0);
			result[0].position.lng.should.be.equal(0);

          done();
      });
	});	
});

