// set up ======================================================================
var express = require('express');
var service = express();
var repeat = require('repeat');
var request = require('request');

//var http = require('http');

var url = 'http://localhost:2222';
var countPosts = 0;
var countGets = 0;

//runTest();
repeat(runTest).every(1, 'ms').for(1, 'sec').start.in(0, 'sec');

function runTest(){

	var message = "MessageTest 20 char."
	var position = {lat:'0', lng:'0'};
	var user_id = 1;

	addPublicMessage(message, position, user_id);
	getPublicMessages();
};

function addPublicMessage(message, position, user_id){
	var req = url + '/api/ssnoc/message/2/0/0/message_20_characters';

	request.post(req, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	    	countPosts++;	
	    	console.log("CountPosts: " + countPosts);		
		}
	});
};

function getPublicMessages(){
	var req = url + '/api/ssnoc/messages';
	request.get(req, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	countGets++;
	    console.log("CountGets: " + countGets);
	  }
	});
};
