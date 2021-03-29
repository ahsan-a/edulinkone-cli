var fs = require('fs');

var credentials = JSON.parse(fs.readFileSync('./src/config/credentials.json'));
var school = JSON.parse(fs.readFileSync('./src/config/school.json'));
var user = {};
var homework = {};

module.exports = {
	credentials,
	school,
	user,
	homework,
};
