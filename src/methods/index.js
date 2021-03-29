const fs = require('fs');
var state = require('../state');

module.exports = {
	capitilise: function (sentence) {
		return sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
	},
	updateConfig: function (name) {
		fs.writeFileSync(`./src/config/${name}.json`, JSON.stringify(state[name], null, `\t`));
	},
	updateAllConfig: function () {
		const configItems = ['credentials', 'school'];
		for (const item of configItems) {
			this.updateConfig(item);
		}
	},
	signOut: function () {
		for (const stateItem in state) {
			if (Object.hasOwnProperty.call(state, stateItem)) {
				console.log(stateItem);
				if (stateItem != 'uuid') {
					state[stateItem] = {};
				}
			}
		}
		this.updateAllConfig();
	},
};
