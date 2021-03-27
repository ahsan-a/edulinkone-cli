var fs = require('fs');

var credentials = JSON.parse(fs.readFileSync('./src/config/credentials.json'));

exports.credentials = credentials;
