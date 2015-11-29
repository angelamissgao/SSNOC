var Member = require('../models/memberModel');
var Message = require('../models/messageModel');
var path = require('path');
var public_receiver = 0;
var announcement_receiver = 1;
var emergency_receiver = 999;

exports.addPublicMessage = function(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member !== null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}
				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

};

exports.addAnnouncement = function(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member !== null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, receiver_id: announcement_receiver,status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}

				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

};

exports.addEmergency = function(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member !== null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, receiver_id: emergency_receiver,status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}

				io.emit('emergency', mymessage);
				res.json(mymessage);
			});
		}
	});

};

exports.getPublicMessages = function(res){
    Message.find({
    	$or: [{receiver_id: public_receiver},{receiver_id: announcement_receiver},{receiver_id: emergency_receiver}]
    }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.getAnnouncements = function(res){
    Message.find({receiver_id: announcement_receiver}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.getEmergencies = function(res){
    Message.find({receiver_id: emergency_receiver}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.getPrivateMessages = function(req,res){

	Message.find({
				$or:[
				{$and: [{member_id: req.params.member_id}, {receiver_id: req.params.receiver_id}]},
				{$and: [{receiver_id: req.params.member_id}, {member_id: req.params.receiver_id}]}]
			},
		function(err, messages) {
			if (err) {
				return res.send(err);	
			}

			res.json(messages); 
		});
};

exports.addPrivateMessage = function(req, res, io){
	var member_id = req.params.member_id;
	var message = req.params.message;
	var receiver_id = req.params.receiver_id;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}
		if (member !== null && member !== undefined) {
			Member.findById(receiver_id, function(err,receiver){
				if (receiver !== null && receiver !== undefined) {
				
					mymessage = new Message({message: message, member_id: member_id, receiver_id: receiver_id,status: member.status,
			 				position: {lng: longitude, lat: latitude}});
					
					mymessage.save(function (err, obj) { 
						if (err) {
							return res.send(err);
						}

						io.emit('privatemessage', mymessage);
						res.json(mymessage);
					});
				}
			});
		}
	});
};


exports.searchPublicMessages = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [ {message: new RegExp(search_message)},
                          {receiver_id: public_receiver}]
        
          }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );
};

exports.searchPrivateMessages = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [{message: new RegExp(search_message)},
		{$or:[
				{$and: [{member_id: req.params.member_id}, {receiver_id: req.params.receiver_id}]},
				{$and: [{receiver_id: req.params.member_id}, {member_id: req.params.receiver_id}]}
				]}
					]

					}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );	
};

exports.searchAnnouncements = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [{message: new RegExp(search_message)},
												 {receiver_id: announcement_receiver}]

				}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );
};

