var fs = require('fs');
const path = require('path');

var credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/credentials.json')));
var school = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/school.json')));
var user = {};
var homework = {};

module.exports = {
	credentials,
	school,
	user,
	homework,
};
