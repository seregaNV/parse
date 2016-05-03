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
		countTotalQueries: function* countTotalQueries(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countTotalQueries'),
				filterPath: 'count'
			};

			let result = yield client.count(query);
			return result.count;
		},

		/**
		 * @func countUniqQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет количество уникальных запросов
		 * @returns {{uniqQueries: int}}
		 */
		countUniqQueries: function* countUniqQueries(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countUniqQueries'),
				filterPath: 'aggregations.UniqQueries.value'
			};

			let result = yield client.search(query);
			return result.aggregations.UniqQueries.value;
		},

		/**
		 * @func countIdentUsers
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет количество идентифицированных пользователей
		 * @returns {{countIdentUsers: int}}
		 */
		countIdentUsers: function* countIdentUsers(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countIdentUsers'),
				filterPath: 'aggregations.IdentUsers.value'
			};

			let result = yield client.search(query);
			return result.aggregations.IdentUsers.value;
		},

		/**
		 * @func countIdentUsersQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет общее количество запросов от идентифицированных пользователей
		 * @returns {{identUsersQueries: int}}
		 */
		countIdentUsersQueries: function* countIdentUsersQueries(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countIdentUsersQueries'),
				filterPath: 'count'
			};

			let result = yield client.count(query);
			return result.count;
		},

		/**
		 * @func countUsersUniqQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет общее количество уникальных запросов от идентифицированных пользователей
		 * @returns {{usersUniqQueries: int}}
		 */
		countIdendUsersUniqQueries: function* countUsersUniqQueries(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countIdentUsersUniqQueries')
			};
			let result = yield client.search(query);
			let calculateIdentUserUniqQueries = function () {
				//let data = result[0].aggregations.wId.buckets;
				let data = result.aggregations.wId.buckets;
				let counter = 0;
				for (var i = 1, i_max = data.length; i < i_max; i++) {
					counter += (data[i].qh_num.value);
				}
				return counter;
			};
			return calculateIdentUserUniqQueries();
		},

		/**
		 * @func countSpecQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет общее количество специализированных запросов
		 * @returns {{specQueries: int}}
		 */
		countSpecQueries: function* countSpecQueries(indexName, docTypeName) {

			// Получить поля документа
			let reqProps = yield this._getDocFields(indexName, docTypeName);

			// Создать массив с ключами запросов
			let reqKeys = [];
			for (let reqProps_i in reqProps) {
				reqKeys.push(reqProps_i)
			}

			// Очистить массив от ряда ключей
			let standartKeys = ['marka_id', 'model_id', 'city', 'currency', 'category_id'];
			for (let standartKeys_i in standartKeys) {
				let exPosition = reqKeys.indexOf(standartKeys[standartKeys_i]);
				if (exPosition != -1) {
					reqKeys.splice(exPosition, 1);
				}
			}

			// Формируем запрос
			let query = {
				index: indexName,
				type: docTypeName,
				filterPath: 'count',
				body: require('./queries/countSpecQueries')
			};

			query.body.filter.or = [];

			for (let reqKeys_i in reqKeys) {
				query.body.filter.or.push(
					{
						"exists": {
							"field": "req." + reqKeys[reqKeys_i]
						}
					}
				);
			}

			let result = yield client.count(query);
			return result.count;
		},

		/**
		 * @func countTopMarkQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет марки с к которым чаще всего обращались
		 * @returns {{topMarkQueries: array[{key: int, doc_count: int}] }}
		 */
		countTopMarkQueries: function* countTopMarkQueries(indexName, docTypeName) {

			let query = {
				index: indexName,
				type: docTypeName,
				body: require('./queries/countTopMarkQueries'),
				filterPath: 'aggregations'
			};

			let result = yield client.search(query);
			return result.aggregations.req_marka_id.buckets;
		},

		/**
		 * @func countKeysQueries
		 * @param indexName {string} Индекс в котором выполняется запрос
		 * @description Вычисляет количество запросов для каждого поля в req
		 * @returns {{keysQueries: {keyName1: int, keyName2: int, ...} }}
		 */
		countKeysQueries: function* countKeysQueries(indexName, docTypeName) {
			// Получить поля документа
			let reqProps = yield this._getDocFields(indexName, docTypeName);

			// Создать массив с ключами запросов
			let reqKeys = [];
			for (let reqProps_i in reqProps) {
				reqKeys.push(reqProps_i)
			}

			function* countKeyQueries(key) {
				let query = {
					index: indexName,
					type: docTypeName,
					filterPath: 'count',
					body: require('./queries/countKeyQueries')
				};
				query.body.filter.exists.field = "req." + key;

				let result = yield client.count(query);
				return result.count;
			}

			// Вычислить количество использований каждого ключа
			let keysQueries = {};
			for (let reqKeys_i in reqKeys) {
				let result = yield countKeyQueries(reqKeys[reqKeys_i]);
				keysQueries[reqKeys[reqKeys_i]] = result
			}
			return keysQueries;
		},

		/**
		 * @func _getIndexes
		 * @description Определяет индексы содержащие журнал запросов
		 * @returns {Array}
		 * @private
		 */
		_getIndexes: function* (queriesIndeces) {
			try {
				let indices = [];
				let results = yield client.cat.indices({v: false, h: "index", index: queriesIndeces});
				results = results.split('\n');
				for (let result of results) {
					if (result && result.indexOf('_pack') < 0) {
						indices.push(result.trim());
					}
				}
				return indices;
			} catch (e) {
				console.log(e);
				return [];
			}
		},

		_getDocFields: function* (indexName, docTypeName) {
			// Получить поля документа
			let getMappingQuery = {
				index: indexName,
				type: docTypeName
			};
			let mappinngResult = yield client.indices.getMapping(getMappingQuery);
			let reqProps = mappinngResult[indexName].mappings[docTypeName].properties.req.properties;
			return reqProps;
		}
	};

}());
