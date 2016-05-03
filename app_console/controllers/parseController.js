"use strict";

const parseMan = require('../managers/parseManager');

/**
 * @module controllers/indexController
 * @exports index/indexController
 */
module.exports = {

	parse: function * (options) {
		console.log('test_controller - ' + options.count);
		yield parseMan.parse(options.count);
	}
};


