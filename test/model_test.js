  // var util = require('util');
  var should = require('should');

  var tungus = require('tungus');
  var mongoose = require('mongoose');


  var Member = require('../app/models/memberModel');
  var Message = require('../app/models/messageModel');
  var TestMessage = require('../app/models/performanceMessageModel');


  mongoose.connect('tingodb://'+__dirname+'/ssnocdb/', function (err) {
    if (err){
      throw err;
    } else {
      console.log("connected to tingodb");
    }
  });


  suite('Models', function () {


    suite('Member', function () {
     test('Create a new Member', function (done) {
      member = new Member({name: 'mike', password: '12345', status: 0});

      member.save(function (err, obj) {   
        if (err) {
          return res.send(err);
        }

          obj.name.should.equal('mike');
          obj.password.should.equal('12345');
          obj.status.should.equal(0);
          done();
        });
    });
  });

    suite('Message', function () {
     test('Add a message', function (done) {

        mymessage = new Message({message: 'Message', member_id: '1', status: 0,
         position: {lng: 0, lat: 0}});
        
        mymessage.save(function (err, obj) { 
          if (err) {
            return res.send(err);
          }

          obj.member_id.should.equal(1);
          obj.message.should.equal('Message');
          obj.status.should.equal(0);

          done();
          });
      });
    });

    suite('PerformanceTestMessage', function () {
     test('Create a performance test message', function (done) {
        mymessage = new TestMessage({message: '20characters_message', member_id: '1', status: 0,
         position: {lng: 0, lat: 0}});
        
        mymessage.save(function (err, obj) { 
          if (err) {
            return res.send(err);
          }

          obj.member_id.should.equal(1);
          obj.message.should.equal('20characters_message');
          obj.status.should.equal(0);

          done();
          });
    });
   });

  mongoose.disconnect();

  });
