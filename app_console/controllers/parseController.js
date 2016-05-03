"use strict";

const parseMan = require('../managers/parseManager');
var request = require('request'),
	Q = require("q"),
	cheerio = require('cheerio'),
	Iconv = require('iconv').Iconv,
	fromEnc = 'cp1251',
	toEnc = 'utf-8',
	translator = new Iconv(fromEnc,toEnc),
	url = 'http://www.infocar.ua/reviews/acura/mdx/2008/3.7-avtomat-suv-id22068.html';
/**
 * @module controllers/parseController
 * @exports parse/parseController
 */
module.exports = {

	parse: function * (options) {
		console.log('test_controller - ' + options.count);
		yield parseMan.parse(options.count);

		//request(url, function (error, response, body) {
		//	if (!error && response.statusCode == 200) {
		//		console.log('body - ', body); // Show the HTML for the Google homepage.
		//	}
		//})

		request({
			url: url,
			encoding: null
		}, function(err, res, body){
			if(err)console.log(err);
			else{
				var $ = cheerio.load(translator.convert(body));
				var reviews = [];
				$('.description').each(function(){
					cards.push({
						description:$('.description').text()
						//url:$('a',this).attr('href')
					});
				});
				console.log('reviews - ', reviews);
			}
		});



		////stage 1
		//request({
		//		url: url,
		//		encoding: null
		//	}, function(err,res, body){
        //
		//	var $ = cheerio.load(translator.convert(body));
		//	var pager = $('.pager');
		//	var limitPage = parseInt( pager.eq(pager.length-1).text().trim(), 10);
		//	//stage 2
		//	function parsePage(page){
		//		var defer = Q.defer();
		//		request('/pager/'+page,function(err,res, body){
		//			if(page<=limitPage){
		//				defer.resolve(page+1); //инкрементируем счетчик страниц прямо в асинхронной последовательности передавая его в качестве аргумента следующим вызовам
		//			} else {
		//				defere.reject();
		//			}
		//			//тут код из первого абстракного примера
		//		});
		//		//возвращаем promise чтобы на нем построить последовательность.
		//		return defer.promise;
		//	}
		//	var chain = Q.fcall(function(){
		//		return parsePage(1);
		//	});
		//	for(var i = 2; i<limitPage;i++){
		//		chain = chain.then(function(page){
		//			return parsePage(page); // цепляем в цепь новые задачи на парсинг, как старые выполнятся.
		//		});
		//	}
		//});


	}

};


