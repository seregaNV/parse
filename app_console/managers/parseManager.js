"use strict";

(function () {

	const elasticsearch = require('elasticsearch');

	let elasticConfig = require('../../config/elasticsearch'),
		client = new elasticsearch.Client(elasticConfig.busearch);

	module.exports = {

		/**
		 * @func countTotalQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет общее количество запросов
		 * @returns {{totalQueries: int}}
		 */
		parse: function* parse(count) {
			console.log('test_manager - ' + count);
		}
	};

}());
