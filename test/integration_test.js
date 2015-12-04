var should = require('should'); 
var request = require('supertest');
var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var apiController = require('../app/apiController.js');

var expect = require('expect.js');


console.log('Running mongoose version %s', mongoose.version);

suite('REST API', function() {
	var server = require('../main');

	var url = 'http://localhost:2222';

	mongoose.connect('tingodb://'+__dirname+'/ssnocdb/');

	test('addMember', function(done) {
		request(url)
		.post('/api/ssnoc/member/mike/12345/0')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
		var result = JSON.parse(res.text);

		result.name.should.be.equal('mike');
		result.password.should.be.equal('12345');
		result.permissionId.should.be.equal(0);
		result.status.should.be.equal(0);
		result.permissionId.should.be.equal(0);

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

	test('addPerformaceTestMessage', function(done) {
		request(url)
		.post('/api/ssnoc/performance/add_message/2/0/0/20characters_message')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

		var result = JSON.parse(res.text);

		result.message.should.be.equal('20characters_message');
		result.member_id.should.be.equal(2);
		result.position.lat.should.be.equal(0);
		result.position.lng.should.be.equal(0);

          done();
      });
	});

	test('getPerformanceTestMessages', function(done) {
		request(url)
		.get('/api/ssnoc/performance/get_message')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			var result = JSON.parse(res.text);

			result[0].message.should.be.equal('20characters_message');
			result[0].member_id.should.be.equal(2);
			result[0].position.lat.should.be.equal(0);
			result[0].position.lng.should.be.equal(0);

          done();
      });
	});	


	test('Add Announcement', function(done) {
		request(url)
		.post('/api/ssnoc/announcement/2/0/0/NewAnnouncement')
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
		.post('/api/ssnoc/private_message/2/0/0/2/PrivateMessage')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

			var result = JSON.parse(res.text);

			result.message.should.be.equal('PrivateMessage');
			result.member_id.should.be.equal(2);
			result.receiver_id.should.be.equal(2);
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

	test('SearchMessage', function(done) {
		request(url)
		.get('/api/ssnoc/search_public_messages/New')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

   		  var result = JSON.parse(res.text);

			result[0].message.should.be.equal('NewMessage');
			result[0].member_id.should.be.equal(2);
			result[0].position.lat.should.be.equal(0);
			result[0].position.lng.should.be.equal(0);

          done();
      });
	});

	test('SearchPrivateMessage', function(done) {
		request(url)
		.get('/api/ssnoc/search_private_messages/Private/2/2')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

   		  var result = JSON.parse(res.text);

			result[0].message.should.be.equal('PrivateMessage');
			result[0].member_id.should.be.equal(2);
			result[0].position.lat.should.be.equal(0);
			result[0].position.lng.should.be.equal(0);

          done();
      });
	});

	test('SearchAnnouncements', function(done) {
		request(url)
		.get('/api/ssnoc/search_announcements/Announcement')
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

	test('SearchMember', function(done) {
		request(url)
		.get('/api/ssnoc/search_membername/mi')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}

   		 	var result = JSON.parse(res.text);

			result[0].name.should.be.equal('mike');
			result[0].password.should.be.equal('12345');

          done();
      });
	});

	test('AddEmergency', function(done) {
		request(url)
		.post('/api/ssnoc/emergency/2/0/0/EmergencyTest')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
   		var result = JSON.parse(res.text);

			result.member_id.should.be.equal(2);
			result.message.should.be.equal('EmergencyTest');

          done();
      });
	});


	test('getEmergency', function(done) {
		request(url)
		.get('/api/ssnoc/emergencies')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
   		var result = JSON.parse(res.text);

			result[0].member_id.should.be.equal(2);
          done();
      });
	});



	test('UpdateProfile', function(done) {
		request(url)
		.post('/api/ssnoc/update_profile/2/mike/12345/1/0')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
   		var result = JSON.parse(res.text);

			result.message.should.be.equal('Profile updated');

          done();
      });
	});

});


