// config
var port = 3000; // port that express runs on
var unauthorizedMessage = 'Unauthorized: are you logged in?';

// imports
var express = require('express');
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dbOps = require('./dbOperations.js'); // our db utility library
var reqOps = require('./reqOperations.js'); // out req utility library // DELETEME // currently unused 
var debug = require('./debugMode.js').debug; // check for debug mode
var verbose = require('./debugMode.js').verbose; // check for verbose logging

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
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies

app.use(function(req, res, next){
	req.key = '4PKLxIXGxBY3ML7Hn7r1Zwwk0t80XlUY'; // DEBUG ONLY // adding a dummy session key while we don't have one
	var auth = require('./authorization.js');
	req.auths = auth.authorized(req);
	next();
})

app.use(function(req, res, next){ // sanitize all requests
	if ((_id = req.body._id) !== undefined){
		_id = new ObjectId(_id);
		req.body._id = _id;
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
		if (req.auths.getApplications == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'applications';
		dbOps.find(uri, collection, req.query, function(result){
			res.json(result);
		});
	})
	.post(function(req, res) {
		if (req.auths.postApplications == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'applications';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.refType = req.body.refType;
		obj.refId = req.body.refId;
		obj.fromType = req.body.fromType;
		obj.fromId = req.body.fromId;
		obj.approved = req.body.approved;
		obj.attachments = req.body.attachments;
		obj.date = req.body.date;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postAttachments == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'attachments';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
		obj.data = req.body.data;
		obj.type = req.body.type;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
		res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postCourses == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'courses';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
		obj.profname = ref.body.profname;
		obj.profid = ref.body.profid;
		obj.description = req.body.description;
		obj.when = req.body.when;
		obj.approved = req.body.approved;
		obj.postdate = req.body.postdate;
		obj.credit = req.body.credit;
		obj.type = req.body.type;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
		if (debug == true){
			console.log('query: ' + JSON.stringify(req.query)) // DEBUG
			console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		}
		obj.name = req.body.name;
		obj.description = req.body.description;
		obj.host = req.body.host;
		obj.hostUser = req.body.hostUser
		obj.hostPartner = req.body.hostPartner;
		obj.start = req.body.start;
		obj.end = req.body.end;
		obj.startTime = req.body.endTime;
		obj.tags = req.body.tags;
		obj.repeatsWeekly = req.body.repeatsWeekly;
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
	.post(function(req, res) {
		if (req.auths.postJobs == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'jobs';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
		obj.description = req.body.description;
		obj.company = req.body.company;
		obj.time = req.body.time;
		obj.pay = req.body.pay;
		obj.credit = req.body.credit;
		obj.approved = req.body.approved;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postPartnerships == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'partnerships';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
		obj.description = req.body.description;
		obj.website = req.body.website;
		obj.approved = req.body.approved;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postPosts == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'posts';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.title = req.body.title;
		obj.text = req.body.text;
		obj.postdate = req.body.postdate;
		obj.tags = req.body.tags;
		obj.authorId = req.body.authorId;
		obj.authorName = req.body.authorName;
		obj.approved = req.body.approved;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
		});
	})
	.delete(function(req, res){
		if (req.auths.postJobs == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'posts';
		dbOps.delete(uri, collection, req.body._id, function(status){
			res.sendStatus(status);
		})
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
	.post(function(req, res) {
		if (req.auths.postResources == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'resources';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.title = req.body.title;
		obj.description = req.body.description;
		obj.target = req.body.target;
		obj.type = req.body.type;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postUsers == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'users';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.username = req.body.name;
		obj.email = req.body.email;
		obj.firstname = req.body.firstname;
		obj.lastname = req.body.lastname;
		console.log('tags: ' + JSON.stringify(req.body.tags));
		dbOps.insert(uri, collection, obj, function(status){
			res.sendStatus(status);
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
	.post(function(req, res) {
		if (req.auths.postPartnerships == false){
			res.status(401).send(unauthorizedMessage);
		}
		var collection = 'partnerships';
		//need both req.query.name && headers. depends on how request is sent
		var obj = new Object();
		console.log('query: ' + JSON.stringify(req.query)) // DEBUG
		console.log('body: ' + JSON.stringify(req.body)); // DEBUG
		obj.name = req.body.name;
			obj.description = req.body.description;
			obj.website = req.body.website;
			obj.approved = req.body.approved;
			console.log('tags: ' + JSON.stringify(req.body.tags));
			dbOps.insert(uri, collection, obj, function(status){
				res.sendStatus(status);
			});
	})

app.use(express.static('public')) // serve static files in public folder

app.listen(port) // start listening on port number