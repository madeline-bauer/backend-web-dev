var express = require('express')();
var debug = require('./debugMode.js').debug;

module.exports = {
	parameter: function(req, parameter){ // DELETEME // there is a fundamental difference between headers and url parameters. it was only by a previous mistake that the two were being used in the same way. this function is no longer needed -tcj 11/3/17
		var response;
		if (req['headers'][parameter.toLowerCase()] !== undefined){
			response = req['headers'][parameter.toLowerCase()];
		} else if (req['query'][parameter] !== undefined){
			response = req['query'][parameter];
		} else {
			response = undefined;
		}
		if (debug == true){
			console.log('reqOperations.js: returned ' + parameter + ' value: ' + response);
			//console.log('reqops headers: ' + req['headers'][parameter.toLowerCase()]); // for some reason this needs to be lowercase -tcj 11/3/17
			//console.log('reqops query: ' + req['query'][parameter]);
		}
		return response;
	}
}