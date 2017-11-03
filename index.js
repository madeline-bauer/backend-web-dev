// imports
var express = require('express');
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;


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

app.route('/users')
	.get(function(req, res){
		
	})


app.route('/events')
	.get(function(req, res) {
		var collection = 'events';
		if (req.query.eventId !== undefined){
			var id = new ObjectId(req.query.eventId); // ?id=<objectId>
			searchDb(collection, {_id: id}, function(result){
				res.json(result);
			})
		} else if (req.query.name !== undefined){ // ?name=<name>
			searchDb(collection, {name: req.query.name}, function(result){
				res.json(result);
			})
		} else {
			searchDb(collection, {}, function(result){
				res.json(result);
			});
		}
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

app.use(express.static('public')) // serve static files in public folder

app.listen(3000) // start listening on port number

// utility functions
function searchDb(collection, query, callback){ // runs a query against the specified mongodb collection // returns the value as a callback
	// Use connect method to connect to the server
	mongo.connect(uri, function(err, db) {
		assert.equal(null, err);
		//console.log("Connected successfully to MongoDB server");
		db.collection(collection).find(query).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			return callback(result);
		});
	});
}

function addDb(collection, obj, callback){ // runs a query against the specified mongodb collection // returns the value as a callback
	mongo.connect(uri, function(err, db) {
	  if (err) throw err;
	  db.collection(collection).insertOne(obj, function(err, res) {
	    if (err) throw err;
	    var status = 200; // no err
	    db.close();
	    return callback(status)
	  });
	}); 
}