var PerformanceMessage = require('../models/performanceMessageModel');
var path = require('path');

exports.addPerformanceMessage = function(req, res, io) {
	var member_id = req.params.member_id;
	var member_status = 1;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;


		performanceMessage = new PerformanceMessage({message: message, member_id: member_id, status: member_status,
		 position: {lng: longitude, lat: latitude}});
		
		performanceMessage.save(function (err, obj) { 
			if (err) {
				return res.send(err);
			}

			res.json(performanceMessage);
		});
};

exports.getPerformanceMessage = function(res){
    PerformanceMessage.find({}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).limit(1);
};

exports.resetPerformanceTest = function(res){
    PerformanceMessage.inventory.remove();
};

