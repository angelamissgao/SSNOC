var memberDataController = require('./controllers/memberDataController.js');
var messageDataController = require('./controllers/messageDataController.js');
var performanceDataController = require('./controllers/performanceDataController.js');
var path = require('path');

module.exports = function(app, io) {

io.on('connection',function(socket){
	socket.on('disconnect', function(){
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
		memberDataController.getMembers(res);
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
		memberDataController.getMember(req, res);
	});

	app.get('/api/ssnoc/memberModel/:member_id', function(req, res) {
		memberDataController.getMemberById(req, res);
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
		memberDataController.updateStatus(req,res,io);
	});

/**
 * @api {post} /api/ssnoc/update_profile/:member_id/:status_id Update member status
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

	app.post('/api/ssnoc/update_profile/:member_id/:name/:password/:permissionId/:accountStatus', function(req, res) {
		memberDataController.updateProfile(req,res,io);
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

	app.post('/api/ssnoc/member/:name/:pass/:permissionId', function(req, res) {
		memberDataController.addMember (req, res);
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
		memberDataController.removeMember(req.params.memeber_id, res);
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
		messageDataController.addPublicMessage(req, res, io);
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
		messageDataController.addAnnouncement(req, res, io);
	});

/**
 * @api {post} /api/ssnoc/emergency/:member_id/:message Post an emergency message
 * @apiGroup Emergency
 *
 * @apiName PostEmergency
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"Bruno is on Help!","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/emergency/:member_id/:latitude/:longitude/:message', function(req, res) {
		messageDataController.addEmergency(req, res, io);
	});

/**
 * @api {get} /api/ssnoc/emergencies Get all emergencies from history
 * @apiGroup Emergency
 * @apiName GetEmergencies
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First emergencies","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second emergencies","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/emergencies', function(req,res) {
		messageDataController.getEmergencies(res);
	});

/**
 * @api {get} /api/ssnoc/emergencies Stop current emergency alerts.
 * @apiGroup Emergency
 * @apiName StopEmergencyes
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
	app.post('/api/ssnoc/stop_emergency', function(req, res) {
		io.emit('stop_emergency');
		//dataController.stopEmergency(req, res, io);
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
		messageDataController.addPrivateMessage(req, res, io);
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
		messageDataController.getPublicMessages(res);
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
		messageDataController.getAnnouncements(res);
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
		messageDataController.getPrivateMessages(req,res);
	});


//Search Function
/**
 * @api {get} /api/ssnoc/search_public_messages/:search_message Search messages from history
 * @apiGroup Search
 * @apiName SearchPublicMessages
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} message
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_public_messages/:search_message',function(req,res){
		messageDataController.searchPublicMessages(req, res);
	});

/**
 * @api {get} /api/ssnoc/search_private_messages/:search_message/:member_id/:receiver_id Search private messages
 * @apiGroup Search
 * @apiName SearchPrivateMessages
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiParam {String} message
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

	app.get('/api/ssnoc/search_private_messages/:search_message/:member_id/:receiver_id',function(req,res){
		messageDataController.searchPrivateMessages(req, res);
	});

/**
 * @api {get} /api/ssnoc/search_announcements/:search_message Search announcements
 * @apiGroup Search
 * @apiName SearhAnnouncements
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_announcements/:search_message',function(req,res){
		messageDataController.searchAnnouncements(req, res);
	});

/**
 * @api {get} /api/ssnoc/search_membername/:search_message Search messages from member
 * @apiGroup Search
 * @apiName SearchMemberNames
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_membername/:search_message',function(req,res){
		memberDataController.searchMemberNames(req, res);
	});

/**
 * @api {get} api/ssnoc/search_memberstatus/:search_message Search member by staus
 * @apiGroup Search
 * @apiName SearchMemberStatus
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member status
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/search_memberstatus/:search_message',function(req,res){
		memberDataController.searchMemberStatus(req, res);
	});

/**
 * @api {post} /api/ssnoc/performance/add_message/:member_id/:latitude/:longitude/:message Add performance message
 * @apiGroup Performance
 *
 * @apiName AddPerformanceMessage
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
 *{"message":"20characters_message","member_id":2,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/performance/add_message/:member_id/:latitude/:longitude/:message', function(req, res) {
		performanceDataController.addPerformanceMessage(req, res, io);
	});

/**
 * @api {get} /api/ssnoc/performance/get_message Get last performance message
 * @apiGroup Performance
 * @apiName GetPerformanceMessage
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{"message":"20characters_message","member_id":2,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */

	app.get('/api/ssnoc/performance/get_message', function(req,res) {
		performanceDataController.getPerformanceMessage(res);
	});

/**
 * @api {post} /api/ssnoc/performance/reset Reset performance test
 * @apiGroup Performance
 * @apiName ResetPerformanceTest
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */

	app.post('/api/ssnoc/performance/reset', function(req,res) {
		performanceDataController.resetTest(res);
	});

//Files

	app.get('*', function(req, res) {
		appRoot = __dirname + '/../public/index.html';
		res.sendFile(path.join(appRoot)); // load the single view file (angular will handle the page changes on the front-end)
	});

};
