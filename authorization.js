module.exports = {
	authorized: function(req){
		var debug = require('./debugMode.js').debug; // check for debug mode
		if (debug == true){
			//console.log(req);
			console.log('session key: ' + req.key);
		}
		var auths = new Object();

		// write some kind of real code here instead of just allowing everything
		auths.getApplications = true;
		auths.postApplications = true;
		auths.getAttachments = true;
		auths.postAttachments = true;
		auths.getCourses = true;
		auths.postCourses = true;
		auths.getEvents = true;
		auths.postEvents = true;
		auths.getPosts = true;
		auths.postPosts = true;
		auths.getResources = true;
		auths.postResources = true;
		auths.getUsers = true;
		auths.postUsers = true;
		auths.getSiteContent = true;
		auths.postSiteContent = true;
		
		return auths;	
	}
}