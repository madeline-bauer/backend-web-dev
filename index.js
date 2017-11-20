// config
var port = 3000 // port that express runs on
var unauthorizedMessage = 'Unauthorized: are you logged in?';

// imports
var express = require('express');
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dbOps = require('./dbOperations.js'); // our db utility library
var reqOps = require('./reqOperations.js'); // out req utility library // DELETEME // currently unused 
var debug = require('./debugMode.js').debug; // check for debug mode

// Connection URL
var uri = require('./mongoDbUri.js').uri;

// express app
var app = express();
console.log(`api running on port ${port}`);

app.use(function(req, res, next) { // allows local requests (ie during development) // remove for production
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true}); // to support URL-encoded bodies

app.use(function(req, res, next){
	req.key = '4PKLxIXGxBY3ML7Hn7r1Zwwk0t80XlUY'; // DEBUG ONLY // adding a dummy session key while we don't have one
	var auth = require('./authorization.js');
	req.auths = auth.authorized(req);
	next();
})

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
			res.status(401).send(unauthorizedMessage);
		}
	}
	next();
})

app.route('/applications')
	.get(function(req, res){
		if (req.auths.getApplication == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'applications';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/attachments')
	.get(function(req, res){
		if (req.auths.getAttachments == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'attachments';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/courses')
	.get(function(req, res){
		if (req.auths.getCourses == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'courses';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/events')
	.get(function(req, res){
		if (req.auths.getEvents == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'events';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})
	.post(function(req, res) {
		if (req.auths.postEvents == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'events';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
		obj.description = req.body.description;
		obj.host = req.body.host;
		obj.when = req.body.when;
		// obj = new Object();
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
		});
	})

app.route('/jobs')
	.get(function(req, res){
		if (req.auths.getJobs == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'jobs';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/partnerships')
	.get(function(req, res){
		if (req.auths.getPartnerships == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'partnerships';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/posts')
	.get(function(req, res){
		if (req.auths.getPosts == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'posts';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/resources')
	.get(function(req, res){
		if (req.auths.getResources == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'resources';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/users')
	.get(function(req, res){
		if (req.auths.getUsers == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'users';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.route('/siteContent')
	.get(function(req, res){
		if (req.auths.getSiteContent == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'siteContent';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})

app.use(express.static('public')) // serve static files in public folder

app.listen(port) // start listening on port number