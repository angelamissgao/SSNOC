var tungus = require('tungus');
var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {message: String, member_id: Number, status: Number,
	timestamp:{ type: Date, default: Date.now }});