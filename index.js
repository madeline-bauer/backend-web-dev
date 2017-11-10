// imports
var express = require('express');
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dbOps = require('./dbOperations.js'); // our db utility library
var reqOps = require('./reqOperations.js'); // out req utility library // DELETEME // currently unused 
var debug = require('./debugMode.js').debug; // check for debug mode


// Connection URL
var uri = require('./mongoDbUri.js').uri;

//console.log(require('./authorization.js').authorized('hello'))

// express app
var app = express();
console.log('api running on port 3000')

app.use(function(req, res, next) { // allows local requests (ie during development) // remove for production
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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
			res.status(401).send('Unauthorized, are you logged in?');
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
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query))
		console.log('body: ' + JSON.stringify(req.body));
		obj.name = req.body.name;
		obj.description = req.body.description;
		obj.host = req.body.host;
		obj.when = req.body.when;
		// fix error checking
		// if (name === undefined || description === undefined || host === undefined || when === undefined){ // check to make sure all fields are defined
		// 	res.status(400).send('All fields required');
		// 	return; // stop processing, do not attempt to insert data into db
		// }
		dbOps.insert(uri, collection, obj, function(status){
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

app.route('/resources')
	.get(function(req, res){
		var collection = 'resources';
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

app.route('/siteContent')
	.get(function(req, res){
		var collection = 'siteContent';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.use(express.static('public')) // serve static files in public folder

app.listen(3000) // start listening on port number