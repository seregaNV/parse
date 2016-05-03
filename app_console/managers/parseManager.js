"use strict";

(function () {

	const elasticsearch = require('elasticsearch');

	let elasticConfig = require('../../config/elasticsearch'),
		client = new elasticsearch.Client(elasticConfig.busearch);

	module.exports = {

		/**
		 * @func parse
		 * @param count
		 * @description Вычисляет общее количество запросов
		 * @returns {{totalQueries: int}}
		 */
		parse: function* parse(count) {
			console.log('test_manager - ' + count);
		}
	};

}());
