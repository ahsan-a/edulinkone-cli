const prompt = require('prompt-sync')({ sigint: true });
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const terminalLink = require('terminal-link');

const edulink = require('../edulink');
const methods = require('../methods');
var state = require('../state');

const prompts = {
	schoolPostcode: function () {
		clear();
		console.log(chalk.magenta(figlet.textSync('Edulink CLI', { horizontalLayout: 'full' })));
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'menu',
					message: 'Welcome! What do you want to do?',
					choices: ['Sign In', 'Quit'],
				},
			])
			.then((answers) => {
				switch (answers.menu) {
					case 'Sign In':
						this.schoolPostcodeInput();
						break;
					case 'Quit':
						process.exit(1);
				}
			});
	},
	schoolPostcodeInput: function () {
		const code = prompt('Please insert your School postcode: ');
		edulink
			.SchoolFromCode(code)
			.then((res) => res.json())
			.then((data) => {
				if (!data.result.success) {
					console.log(chalk.red('Error: Unknown School ID.'));
					this.schoolPostcodeInput();
				} else {
					state.school.code = data.result.school;
					methods.updateConfig('school');
					this.schoolDetails(true);
				}
			});
	},
	schoolDetails: function (login) {
		edulink
			.SchoolDetails()
			.then((res) => res.json())
			.then((data) => {
				if (data.result.success) {
					state.school.details = data.result;
					methods.updateConfig('school');
					if (login) this.loginPrompt();
				} else {
					console.log(chalk.red('error: unknown'));
				}
			});
	},
	loginPrompt: function () {
		clear();
		console.log(chalk.cyan(figlet.textSync(state.school.details.establishment.name, { horizontalLayout: 'full' })));
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'user',
					message: "What's your username?",
				},
				{
					type: 'password',
					name: 'password',
					mask: '*',
					message: "What's your password?",
				},
			])
			.then((answers) => {
				this.login(answers.user, answers.password);
			});
	},
	login: function (user, password) {
		edulink
			.user(user, password)
			.then((res) => res.json())
			.then((data) => {
				if (!data.result.success) {
					console.log(chalk.red(`\nError: ${data.result.error}.`));
					if (prompt('Try again? [y/n]: ').toLowerCase() == 'y') {
						clear();
						this.loginPrompt();
					}
				} else {
					state.credentials = { user, password };
					state.user = data.result;
					methods.updateConfig('credentials');

					this.mainMenu();
				}
			});
	},

	mainMenu: function () {
		clear();
		console.log(chalk.blue(figlet.textSync(methods.capitilise(`Welcome,  ${state.user.user.forename}!`.toLowerCase()))));
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'menu',
					message: 'Pick an option: ',
					choices: ['Manage Homework', 'Sign Out', 'Quit'],
				},
			])
			.then((answers) => {
				switch (answers.menu) {
					case 'Manage Homework':
						this.homeworksMain();
						break;
					case 'Quit':
						process.exit(1);

					case 'Sign Out':
						methods.signOut();
						this.schoolPostcode();
						break;
				}
			});
	},
	homeworksMain: function () {
		clear();
		console.log(chalk.yellow(figlet.textSync('Homework')));
		if (Object.keys(state.homework).length < 1) {
			edulink
				.getHomeworks()
				.then((res) => res.json())
				.then((data) => {
					state.homework = data.result.homework;
				});
		}
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'homeworkMenu',
					message: 'What do you want to do?',
					choices: ['View Current Homework', 'View Past Homework', 'Go Back'],
				},
			])
			.then((answers) => {
				switch (answers.homeworkMenu) {
					case 'View Current Homework':
						this.viewCurrentHomework();
						break;
					case 'View Past Homework':
						this.viewPastHomework();
						break;
					case 'Go Back':
						this.mainMenu();
						break;
				}
			});
	},
	viewCurrentHomework: function () {
		clear();
		console.log(chalk.yellow(figlet.textSync('Current Homework')));
		var currentHomeworks = [];
		currentHomeworks.push('Go Back');
		var homeworkKey = {};
		state.homework.current.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
		for (i in state.homework.current) {
			const homework = state.homework.current[i];
			const name = `${homework.subject}: ${homework.activity} (${Math.round(
				Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24))
			)} ${Math.round(Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24))) == 1 ? 'day' : 'days'}) ${
				homework.completed ? '✅' : '❌'
			}`;
			currentHomeworks.push(name);
			homeworkKey[name] = homework;
		}
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'currentHomeworks',
					message: 'Select a homework',
					choices: currentHomeworks,
					loop: false,
				},
			])
			.then((answer) => {
				if (answer.currentHomeworks == 'Go Back') {
					this.homeworksMain();
				} else {
					this.viewSingleHomework(homeworkKey[answer.currentHomeworks], 'current');
				}
			});
	},
	viewPastHomework: function () {
		clear();
		console.log(chalk.yellow(figlet.textSync('Past Homework')));
		var currentHomeworks = [];
		currentHomeworks.push('Go Back');
		var homeworkKey = {};
		state.homework.past.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
		for (i in state.homework.past) {
			const homework = state.homework.past[i];
			const name = `${homework.subject}: ${homework.activity} (${Math.round(
				Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24))
			)} ${Math.round(Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24))) == 1 ? 'day' : 'days'}) ${
				homework.completed ? '✅' : '❌'
			}`;
			currentHomeworks.push(name);
			homeworkKey[name] = homework;
		}
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'currentHomeworks',
					message: 'Select a homework',
					choices: currentHomeworks,
					loop: false,
				},
			])
			.then((answer) => {
				if (answer.currentHomeworks == 'Go Back') {
					this.homeworksMain();
				} else {
					this.viewSingleHomework(homeworkKey[answer.currentHomeworks], 'past');
				}
			});
	},
	viewSingleHomework: async (homework, returnType) => {
		clear();
		console.log(chalk.yellow(figlet.textSync(`${homework.subject}`)));

		if (homework.attachments.length > 0) {
			var attachments = [];
			for (const a of homework.attachments) {
				await edulink
					.attatchmentFetch(homework.id, a.id)
					.then((res) => res.json())
					.then((data) => {
						attachments.push([a.filename, data.result.attachment.url]);
					});
			}
			prompts.viewHomeworkMain(homework, returnType, attachments);
		} else {
			prompts.viewHomeworkMain(homework, returnType, []);
		}
	},
	viewHomeworkMain: function (homework, returnType, attachments) {
		edulink
			.homeworkDetails(homework.id)
			.then((res) => res.json())
			.then((data) => {
				const homeworkInfo = data.result.homework;
				console.log(chalk.green(chalk.bold(homework.activity)));
				console.log(
					`${chalk.bold('Description:')} \n${homeworkInfo.description
						.replace(/<br>/g, '\n')
						.replace(/<\/?.>/g, '')
						.replace(/&nbsp;/g, '')} \n`
				);

				if (attachments.length > 0) {
					console.log(chalk.bold('Attatchments'));
					for (const a of attachments) {
						console.log(chalk.cyan(terminalLink(a[0], a[1])));
					}
				}

				console.log(
					chalk.red(
						chalk.bold(
							`${Math.round(Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24)))} ${
								Math.round(Math.abs((Date.now() - new Date(homework.due_date).getTime()) / (1000 * 60 * 60 * 24))) == 1
									? 'day'
									: 'days'
							} ${returnType == 'current' ? 'remaining' : 'ago'}`
						)
					)
				);
				console.log('\n');
				inquirer
					.prompt([
						{
							type: 'list',
							name: 'action',
							message: 'Pick an option:',
							choices: [`Mark as ${homework.completed ? 'Not Done' : 'Done'}`, 'Go Back'],
						},
					])
					.then((answer) => {
						switch (answer.action) {
							case 'Go Back':
								if (returnType == 'past') {
									this.viewPastHomework();
								} else {
									this.viewCurrentHomework();
								}
								break;
							case `Mark as ${homework.completed ? 'Not Done' : 'Done'}`:
								edulink.homeworkCompletion(homework.id, !homework.completed);
								edulink
									.getHomeworks()
									.then((res) => res.json())
									.then((data) => {
										state.homework = data.result.homework;
										if (returnType == 'past') {
											this.viewPastHomework();
										} else {
											this.viewCurrentHomework();
										}
									});
								break;
						}
					});
			});
	},
};

module.exports = prompts;
