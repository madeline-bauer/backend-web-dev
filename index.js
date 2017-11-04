// imports
var express = require('express');
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dbOps = require('./dbOperations.js'); // our db utility library
// var reqOps = require('./reqOperations.js'); // out req utility library // DELETEME // currently unused 
var debug = require('./debugMode.js').debug; // check for debug mode


// Connection URL
var uri = require('./mongoDbUri.js').uri;

//console.log(require('./authorization.js').authorized('hello'))

// express app
var app = express();

app.use(function(req, res, next) { // allows local requests (ie during development) // remove for production
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(function(req, res, next){ // sanitize all requests
	if ((id = req.query._id) !== undefined){
		id = new ObjectId(id);
		req.query._id = id;
	}
	if ((approved = req.query.approved) !== undefined){
		if (approved == 'true'){
			req.query.approved = true;
		} else if (approved == 'false'){
			req.query.approved = false;
		}
	}
	next();
})

app.route('/applications')
	.get(function(req, res){
		var collection = 'applications';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/attachments')
	.get(function(req, res){
		var collection = 'attachments';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/courses')
	.get(function(req, res){
		var collection = 'courses';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/events')
	.get(function(req, res){
		var collection = 'events';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})
	.post(function(req, res) {
		var collection = 'events';
		//need both req.query.name && headers. depends on how request is sent
		var name = req.get('name');
		var description = req.get('description');
		var host = req.get('host');
		var when = req.get('when');
		// fix error checking
		// if (name === undefined || description === undefined || host === undefined || when === undefined){ // check to make sure all fields are defined
		// 	res.status(400).send('All fields required');
		// 	return; // stop processing, do not attempt to insert data into db
		// }
		var obj = new Object();
		obj.name = name;
		obj.description = description;
		obj.host = host;
		obj.when = when;
		console.log(obj);
		addDb(collection, obj, function(status){
			res.sendStatus(status);
		});
	})

app.route('/jobs')
	.get(function(req, res){
		var collection = 'jobs';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/partnerships')
	.get(function(req, res){
		var collection = 'partnerships';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/posts')
	.get(function(req, res){
		var collection = 'posts';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/users')
	.get(function(req, res){
		var collection = 'users';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.use(express.static('public')) // serve static files in public folder

app.listen(3000) // start listening on port number