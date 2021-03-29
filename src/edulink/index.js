const fetch = require('node-fetch');
var state = require('../state');
const { v4: uuidv4 } = require('uuid');

const methods = {
	SchoolFromCode: function (postcode) {
		return fetch('https://provisioning.edulinkone.com/?method=School.FromCode', {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"School.FromCode","params":{"code":"${postcode}"},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'omit',
		});
	},
	SchoolDetails: function () {
		return fetch(`${state.school.code.server}?method=EduLink.SchoolDetails`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.SchoolDetails',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.SchoolDetails","params":{"establishment_id":"${
				state.school.code.school_id
			}","from_app":false},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'omit',
		});
	},
	user: function (username, password) {
		return fetch(`${state.school.code.server}?method=EduLink.Login`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.Login',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.Login","params":{"from_app":false,"ui_info":{"format":2,"version":"0.5.153","git_sha":"bd4bd9ecc749884a2490c81d6f9169f09a9f3df1"},"fcm_token_old":"none","username":"${username}","password":"${password}","establishment_id":${
				state.school.code.school_id
			}},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'omit',
		});
	},
	getHomeworks: function () {
		return fetch(`${state.school.code.server}?method=EduLink.Homework`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				authorization: `Bearer ${state.user.authtoken}`,
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.Homework',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.Homework","params":{"format":2},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});
	},
	homeworkDetails: function (id) {
		return fetch(`${state.school.code.server}?method=EduLink.HomeworkDetails`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				authorization: `Bearer ${state.user.authtoken}`,
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.HomeworkDetails',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.HomeworkDetails","params":{"homework_id":${id},"source":"EduLink"},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});
	},
	homeworkCompletion: function (id, completed) {
		return fetch(`${state.school.code.server}?method=EduLink.HomeworkCompleted`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				authorization: `Bearer ${state.user.authtoken}`,
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.HomeworkCompleted',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.HomeworkCompleted","params":{"homework_id":${id},"learner_id":"${state.user.user.id}","source":"EduLink","completed":"${completed}"},"uuid":"2d297a2b-6d9b-4d76-a3ff-cf08f5f1276a","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});
	},
	attatchmentFetch: function (homework_id, attachment_id) {
		return fetch(`${state.school.code.server}?method=EduLink.HomeworkAttachmentFetch`, {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				authorization: `Bearer ${state.user.authtoken}`,
				'content-type': 'application/json;charset=UTF-8',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
				'sec-gpc': '1',
				'x-api-method': 'EduLink.HomeworkAttachmentFetch',
			},
			referrerPolicy: 'no-referrer',
			body: `{"jsonrpc":"2.0","method":"EduLink.HomeworkAttachmentFetch","params":{"homework_id":${homework_id},"attachment_id":${attachment_id},"format":2},"uuid":"${uuidv4()}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});
	},
};

module.exports = methods;
