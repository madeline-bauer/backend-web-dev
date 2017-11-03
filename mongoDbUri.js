//returns a valid mongoDB connect URI with credentials found in `dbCredentials.js`

var uri = `mongodb://${require('./dbCredentials.js').user}:${require('./dbCredentials.js').pass}@${require('./dbCredentials.js').uri}`;
exports.uri = uri;