"use strict";

(function () {

	const elasticsearch = require('elasticsearch');

	let elasticConfig = require('../../config/elasticsearch'),
		client = new elasticsearch.Client(elasticConfig.busearch),
		Q = require('q'),
		request = require('request'),
		cheerio = require('cheerio'),
		Iconv = require('iconv').Iconv,
		fromEnc = 'cp1251',
		toEnc = 'utf-8',
		translator = new Iconv(fromEnc,toEnc);
	module.exports = {

		/**
		 * @func parse
		 * @param count
		 * @description Вычисляет общее количество запросов
		 * @returns {{totalQueries: int}}
		 */
		//parse: function* parse(count) {
		//	console.log('test_manager - ' + count);
		//}

		getDataForParse: function(url) {
			var deferred = Q.defer();
			request({
				url: url,
				encoding: null
			}, function(err, res, body){
				if(err)deferred.reject(false);
				else deferred.resolve(body);
			});
			return deferred.promise;
		},

		parseDataInfocar: function(data) {
			var $ = cheerio.load(translator.convert(data)),
				reviews = {};

			// добавляємо назву
			reviews.title = $('h1.summary').text();

			// добавляємо автора
			var autorArr = {};
			var user = $('.user');
			autorArr.name = user.find('a > span').text();
			// autorArr.country = user.find('span.adr > span.country-name').text(); // питання ??? чи нада вказувати страну
			autorArr.city = user.find('span.adr > span.locality').text();
			autorArr.date = user.find('span.dtreviewed').text();
			reviews.autor = autorArr;

			// добавляємо авто
			var autoArr = {};
			$('.car > p > i').each(function(){
				autoArr[$(this).text().slice(0, -1)] = $(this).next().text();
			});
			reviews.auto = autoArr;

			// добавляємо опис і те, що користувач дописав
			var descr = [];
			$('.description').each(function(){
				descr.push($('.description').text() );
			});
			$('div.hreview > p > strong').each(function(){
				var container = $(this).parent();
				if (!container.attr('id')) {
					descr.push(container.text() );
				}
			});
			// var newDescr = descr.map(function(item) {
			//   var reg = /(\\[rn])/g;
			//   return item.replace(reg, " ");
			// });
			// reviews.push(newDescr);
			reviews.description = descr;

			// добавляємо плюси
			reviews.plus = $('#plus span.pro').text();

			// добавляємо минуси
			reviews.minus = $('#minus span.contra').text();

			// добавляємо совєти
			reviews.advice = $('#sovet > span').text();

			// добавляємо бали
			var ratesArr = [];
			$('.rates span').each(function(){
				ratesArr.push($(this).attr('title'));
			});
			reviews.rates = ratesArr;

			return reviews;

		},

		parseDataAutonavigator: function(data) {
			var $ = cheerio.load(translator.convert(data)),
				reviews = {};

			// добавляємо назву
			reviews.title = $('h1').text();

			// var infoContainer = $('.brief, .item, .hproduct');
			// добавляємо автора
			var autorArr = {};
			var user = $('.brief, .item, .hproduct').find('.meta');
			autorArr.name = user.find('a.name').text();
			// autorArr.country = '';
			autorArr.city = user.find('span.locality').text();
			autorArr.date = user.find('div.date').text();
			reviews.autor = autorArr;

			// добавляємо авто
			var autoArr = {};
			$('.hproduct > p').each(function(){
				/([\s\dа-яА-ЯёЁ\-.]*):([\s\dа-яА-ЯёЁ\-.,]*)/.exec($(this).text());
				autoArr[RegExp.$1] = RegExp.$2;
				// autoArr.push($(this).text()); // можна прощє, але в вигляді масіва. Поміняти (var autoArr = [])
			});
			reviews.auto = autoArr;

			// добавляємо опис
			var descr = [];
			$('.description').each(function(){
				descr.push($('.description').text() );
			});
			reviews.description = descr;

			// добавляємо плюси
			reviews.plus = $('.plus > p').text();

			// добавляємо минуси
			reviews.minus = $('.minus > p').text();

			// добавляємо совєти
			reviews.advice = $('.advice > p').text();

			// добавляємо бали
			var ratesArr = [];
			$('.allStars div').each(function(){
				var parseValue,
					value = $(this).find('span > i').attr('style');
				if (value) {
					parseValue = Number(value.replace(/\D+/g,""))/20;
				} else {
					parseValue = $(this).find('span').text();
				}
				ratesArr.push($(this).find('label').text() + ': ' + parseValue);
			});
			reviews.rates = ratesArr;

			return reviews;

		}

	};

}());
