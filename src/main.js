#!/usr/bin/env node

// imports
var state = require('./state');
const prompts = require('./prompts');

if (Object.keys(state.credentials).length < 1) {
	prompts.schoolPostcode();
} else {
	prompts.schoolDetails(false);
	prompts.login(state.credentials.user, state.credentials.password);
}
