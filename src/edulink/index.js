const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const fetch = require('node-fetch');

const methods = {
	SchoolFromCode: async (postcode) => {
		fetch('https://provisioning.edulinkone.com/?method=School.FromCode', {
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
			body: `{"jsonrpc":"2.0","method":"School.FromCode","params":{"code":"${postcode}"},"uuid":"${uuid}","id":"1"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'omit',
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	},
};

module.exports = methods;
