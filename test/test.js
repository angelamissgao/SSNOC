
var Member = require('./app/models/memberModel');
var Message = require('./app/models/messageModel');

describe('testuser', function () {
 it('find Member', function () {
   
   Member.findOne({name: 1111}, function(err, members) {

      // res.json(members); 
      console.log(members);

    });
   // must call done() so that mocha know that we are... done.
   // Useful for async tests.
 

 });
});