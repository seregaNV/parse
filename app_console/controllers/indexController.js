"use strict";

const buSearch = require('../managers/buSearchManager'),
	buSearchManagerToTrendsWrapper = require('../helpers/buSearchManagerToTrendsWrapper'),
	trends = require('../../common/managers/trendsManager');

let queriesIndeces = "busearch*";
let docTypeName = "busearch";
/**
 * @module controllers/indexController
 * @exports index/indexController
 */
module.exports = {

	index: function * (options) {
		// Обход всех индексов buSearch

		let buIndexes = yield buSearch._getIndexes(queriesIndeces);
		if (buIndexes.length < 1) {
			throw {
				name: "Error",
				message: "busearch indexes not found"
			}
		}

		for (let buIndex of buIndexes) {
			let result = yield trends.existsDocument(buIndex.substr(9));
			// проверка на повторную обработку, если options.mode=new, то не пропускать уже обработаные,
			// иначе повторно обработать все индексы
			if (result && options.mode == "new") {
				console.log('=====> ' + buIndex + ' был обработан ранее\n');
			} else {
				console.log('=====> ' + buIndex + '\n');
				for (let key in buSearchManagerToTrendsWrapper) {
					try {
						let result = yield buSearchManagerToTrendsWrapper[key](buIndex, docTypeName);
						console.log('> ' + buSearchManagerToTrendsWrapper[key].name);
						yield trends.setDocument(result, buIndex.substr(9));
					} catch (e) {
						console.log(e.message);
					}
				}
			}
			console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n');
		}
	},
};


