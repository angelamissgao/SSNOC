var Member = require('./models/memberModel');
var Message = require('./models/messageModel');
var path = require('path');
var public_receiver = 0;
var announcement_receiver = 1;


function getMembers(res){
	Member.find(function(err, members) {

			if (err) {
				return res.send(err)	
			}

			res.json(members);
		});
};

function getMember(req, res){
	Member.findOne({name: req.params.name}, function(err, members) {
			if (err) {
				return res.send(err)	
			}

			res.json(members); 
			// console.log(members);
		});
};

function addMember (req, res) {

	member = new Member({name: req.params.name, password: req.params.pass, status: 0});
	
	member.save(function (err, obj) {	  
		if (err) {
			return res.send(err);
		}
		res.json(member);
	});
}

function removeMember (id, res) {
	Member.remove({_id: id}, function(err, obj) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Member '+ id + ' successfully removed' });
    });
}

function updateStatus (req, res, io) {
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	console.log('updateStatus id' + req.params.member_id);

	Member.findById(req.params.member_id, function(err, member) {
			if (err) {
				return res.send(err);
			}

		member.status = req.params.status_id;

		console.log("current status is "+member.status);

		member.save(function(err) {
			if (err) {
				return res.send(err);
			}
			io.emit('userStatusChange');
			res.json({ message: 'Status updated: Member ' + req.params.member_id + ' status is ' + req.params.status_id 
				+ 'and location is ' + latitude + ' ; ' + longitude});

		});
	});
};

function addPublicMessage(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member != null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}
				io.emit('message', mymessage);
				res.json(mymessage);
				// console.log(mymessage);
			});
		}
	});

}

function addAnnouncement(req, res, io) {
	console.log("api socket announcement " + io.sockets);
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member != null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, receiver_id: announcement_receiver,status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}
				// console.log("addAnnouncement: ", mymessage);
				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

}

function getPublicMessages(res){
    Message.find({
    	$or: [{receiver_id: public_receiver},{receiver_id: announcement_receiver}]
    }, function(err, messages) {

            if (err) {
                return res.send(err)    
            }

            console.log("getPublicMessages: " + messages);
            res.json(messages); 
        });
};

function getAnnouncements(res){
    Message.find({receiver_id: announcement_receiver}, function(err, messages) {

            if (err) {
                return res.send(err)    
            }

            // console.log("getAnnouncements: " + messages);
            res.json(messages); 
        });
};

function getPrivateMessages(req,res){

	console.log("get private messages");

	console.log("get private messages from api" + req.params.member_id + " " + req.params.receiver_id);


	Message.find({
				$or:[
				{$and: [{member_id: req.params.member_id}, {receiver_id: req.params.receiver_id}]},
				{$and: [{receiver_id: req.params.member_id}, {member_id: req.params.receiver_id}]}]
			}
		,function(err, messages) {
			if (err) {
				return res.send(err)	
			}

			res.json(messages); 
		});
};

function addPrivateMessage(req, res, io){
	console.log("api log on socket " + io.sockets);
	var member_id = req.params.member_id;
	var message = req.params.message;
	var receiver_id = req.params.receiver_id;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}
		if (member != null && member !== undefined) {
			Member.findById(receiver_id, function(err,receiver){
				if (receiver != null && receiver !== undefined) {
				
					mymessage = new Message({message: message, member_id: member_id, receiver_id: receiver_id,status: member.status,
			 				position: {lng: longitude, lat: latitude}});
					
					mymessage.save(function (err, obj) { 
						if (err) {
							return res.send(err);
						}
						console.log("private message " + mymessage);
						io.emit('privatemessage', mymessage);
						res.json(mymessage);
					});
				}
			});
		}

	});

}

module.exports = function(app, io) {


io.on('connection',function(socket){
	console.log("user connected");
	socket.on('disconnect', function(){
		console.log("user disconnected");
	});
});
// API Calls
//Members
/**
 * @api {get} /api/ssnoc/directory List all members in the directory
 * @apiGroup Member
 * @apiName GetMembers
 *
 * @apiSuccess {String} JSON with members information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */
	app.get('/api/ssnoc/directory', function(req, res) {
		getMembers(res);
	});

/**
 * @api {get} /api/ssnoc/member:name List member information
 * @apiGroup Member
 *
 * @apiName GetMember
 *
 * @apiParam {String} user name
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */

	app.get('/api/ssnoc/member/:name', function(req, res) {
		getMember(req, res);
	});

/**
 * @api {post} /api/ssnoc/update_status/:member_id/:status_id Update member status
 * @apiGroup Member
 *
 * @apiName UpdateStatus
 *
 * @apiParam {Number} user id
 *
 * @apiParam {Number} status id
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */

	app.post('/api/ssnoc/update_status/:member_id/:latitude/:longitude/:status_id', function(req, res) {
		updateStatus(req,res,io);
	});

/**
 * @api {post} /api/ssnoc/member/:name/:pass Add members to directory
 * @apiGroup Member
 *
 * @apiName AddMember
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiParam {String} user name
 *
 * @apiParam {String} password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{ message: 'Status updated: Member 3 status is 2 }]
 */

	app.post('/api/ssnoc/member/:name/:pass', function(req, res) {

		addMember (req, res);
	});

/**
 * @api {delete} /api/ssnoc/update_status/:member_id/:status_id Remove member from directory
 * @apiGroup Member
 *
 * @apiName RemoveMember
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiParam {Number} member_id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{ message: 'Member Test successfully removed' }]
 */

	app.delete('/api/ssnoc/member/:member_id', function(req, res) {
		removeMember(req.params.memeber_id, res);
	});

//Chat
/**
 * @api {post} /api/ssnoc/message/:member_id/:message Add message to chat
 * @apiGroup Messages
 *
 * @apiName AddMessage
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/message/:member_id/:latitude/:longitude/:message', function(req, res) {
		addPublicMessage(req, res, io);
	});

/**
 * @api {post} /api/ssnoc/announcement/:member_id/:message Post an announcement
 * @apiGroup Messages
 *
 * @apiName PostAnnouncement
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/announcement/:member_id/:latitude/:longitude/:message', function(req, res) {
		addAnnouncement(req, res, io);
	});

/**
 * @api {post} /api/ssnoc/privateMessage/:member_id/:receiver_id/:message Add private message to chat
 * @apiGroup Messages
 *
 * @apiName AddPrivateMessage
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"receiver_id":2,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/private_message/:member_id/:latitude/:longitude/:receiver_id/:message', function(req, res) {
		addPrivateMessage(req, res, io);
	});


/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Messages
 * @apiName GetPublicMessages
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/messages', function(req,res) {
		getPublicMessages(res);
	});

/**
 * @api {get} /api/ssnoc/announcements Get all announcements from history
 * @apiGroup Messages
 * @apiName GetAnnouncements
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First announcement","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second announcement","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/announcements', function(req,res) {
		getAnnouncements(res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Messages
 * @apiName GetPrivateMessages
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/private_messages/:member_id/:receiver_id', function(req, res) {
		getPrivateMessages(req,res);
	});

//Files

	app.get('/chatting', function(req, res) {
		appRoot = __dirname + '/../public/ChatPublicly.html';
		res.sendFile(appRoot); // load the single view file (angular will handle the page changes on the front-end)
	});
	
	app.get('*', function(req, res) {
		appRoot = __dirname + '/../public/index.html';
		console.log(appRoot);
		res.sendFile(path.join(appRoot)); // load the single view file (angular will handle the page changes on the front-end)
	});


};
