var Member = require('../models/memberModel');
var path = require('path');

exports.getMembers = function(res){
	Member.find(function(err, members) {

			if (err) {
				return res.send(err);	
			}

			res.json(members);
		});
};

exports.getMember = function(req, res){	

	var reqName = req.params.name;
	console.log("Name " + reqName);
	Member.findOne({name: reqName}, function(err, members) {
			if (err) {			
				return res.send(err);	
			}
			console.log("Found member " + members);
			
			return res.json(members); 
	});
};


exports.getMemberById = function(req, res){
	Member.findOne({_id: req.params.member_id}, function(err, member) {
			if (err) {
				return res.send(err);	
			}
			res.json(member); 
		});
};

exports.addMember = function(req, res) {

	member = new Member({name: req.params.name, password: req.params.pass, status: 0});
	
	member.save(function (err, obj) {	  
		if (err) {
			return res.send(err);
		}
		res.json(member);
	});
};

exports.removeMember = function(id, res) {
	Member.remove({_id: id}, function(err, obj) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Member '+ id + ' successfully removed' });
    });
};

exports.updateStatus = function(req, res, io) {
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(req.params.member_id, function(err, member) {
			if (err) {
				return res.send(err);
			}

		member.status = req.params.status_id;

		member.save(function(err) {
			if (err) {
				return res.send(err);
			}
			io.emit('userStatusChange');
			res.json({ message: 'Status updated: Member ' + req.params.member_id + ' status is ' + req.params.status_id +
				'and location is ' + latitude + ' ; ' + longitude});

		});
	});
};

exports.searchMemberNames = function(req,res){
	var search_membername = req.params.search_message;
	Member.find({name: new RegExp(search_membername)}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.searchMemberStatus = function(req,res){
  var search_memberstatus = req.params.search_message;
  Member.find({status: search_memberstatus }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 

        });
};

