#!/usr/bin/env node

// imports
const program = require('commander');

var state = require('./state');
const prompts = require('./prompts');

//commander
program.version('0.0.1');

if (Object.keys(state.credentials).length < 1) {
	prompts.schoolPostcode();
} else {
	prompts.schoolDetails(false);
	prompts.login(state.credentials.user, state.credentials.password);
}
