#!/usr/bin/env node

// imports
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const path = require('path');
const program = require('commander');
const prompt = require('prompt-sync')({ sigint: true });

var state = require('./state');
const edulink = require('./edulink');

//commander
program.version('0.0.1');

clear();
console.log(chalk.magenta(figlet.textSync('Edulink CLI', { horizontalLayout: 'full' })));

if (!Object.keys(state.credentials).length) {
	const code = prompt('Welcome! Please insert your School postcode: ');

	edulink.SchoolFromCode(code);
}
