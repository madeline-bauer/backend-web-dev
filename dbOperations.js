var mongo = require('mongodb').MongoClient, assert = require('assert');
var debug = require('./debugMode.js').debug;

module.exports = {
	find: function(uri, collection, query, callback){
		// Use connect method to connect to the server
		if (debug == true){
			console.time("mongoDB connection time");
			console.log('running find query for: ' + JSON.stringify(query));
		}
		mongo.connect(uri, function(err, db) {
			assert.equal(null, err);
			//console.log("Connected successfully to MongoDB server");
			db.collection(collection).find(query).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				if (debug == true){console.timeEnd("mongoDB connection time");}
				return callback(result);
			});
		});
	},
	insert: function(uri, collection, obj, callback){ // runs a query against the specified mongodb collection // returns the value as a callback
		mongo.connect(uri, function(err, db) {
			if (err) throw err;
			db.collection(collection).insertOne(obj, function(err, res) {
				if (err) throw err;
				var status = 200; // no err
				db.close();
				return callback(status)
			});
		}); 
	},
	delete: function(uri, colleciton, id, callback){
		mongo.connect(uri, function(err, db) {
			if (err) throw err;
			db.collection(collection).deleteOne({_id: id}, function(err, res) {
				if (err) throw err;
				var status = 200; // no err
				db.close();
				return callback(status)
			});
		}); 
	}
}