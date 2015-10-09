var Member = require('./models/memberModel');
var Message = require('./models/messageModel');
var path = require('path');


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
			console.log(members);
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

function updateStatus (req, res) {

	console.log('updateStatus id' + req.params.member_id);

	Member.findById(req.params.member_id, function(err, member) {
			if (err) {
				return res.send(err);
			}

		console.log('updateStatus' + member);

		member.status = req.params.status_id;

		member.save(function(err) {
			if (err) {
				return res.send(err);
			}

			res.json({ message: 'Status updated: Member ' + req.params.member_id + ' status is ' + req.params.status_id });
		});
	});
};

function addPublicMessage(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member != null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, status: member.status});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}
				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

}

function getPublicMessages(res){
	Message.find(function(err, messages) {

			if (err) {
				return res.send(err)	
			}

			res.json(messages); // return all todos in JSON format
		});
};

module.exports = function(app, io) {

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

	app.post('/api/ssnoc/update_status/:member_id/:status_id', function(req, res) {
		updateStatus(req,res);
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
	app.post('/api/ssnoc/message/:member_id/:message', function(req, res) {
		addPublicMessage(req, res, io);
	});

/**
 * @api {get} /api/ssnoc/directory Get all messages from history
 * @apiGroup Messages
 * @apiName GetMessages
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/messages', function(req, res) {
		getPublicMessages(res);
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
