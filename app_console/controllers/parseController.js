"use strict";

const parseMan = require('../managers/parseManager');

/**
 * @module controllers/parseController
 * @exports parse/parseController
 */
module.exports = {

	/**
	 * cd /var/www/news_koa_node; /usr/bin/node --harmony ./console.js --section test --action pars
	 * cd /home/student/Documents/work/parse; /usr/bin/node --harmony ./console.js --section parse --action parse --opt.count=1000
	 * ./console.js --section parse --opt.count=1000
	 * @param options
	 */
	parse : function* (options) {
		var parseData,
			resource = ['infocar.ua', 'autonavigator.ru'],
		// url= 'http://www.infocar.ua/reviews/acura/mdx/2008/3.7-avtomat-suv-id22068.html',
		// url= 'http://www.infocar.ua/reviews/toyota/corolla/2011/1.3-mehanika-sedan-id22162.html', // дописано
		// url= 'http://www.infocar.ua/reviews/toyota/corolla/2011/1.3-mehanika-sedan-id21142.html', // дописано + совет
		// url= 'http://www.infocar.ua/reviews/toyota/corolla/2008/1.6-mehanika-sedan-id20625.html', // "-"
		// url= 'http://www.infocar.ua/reviews/toyota/corolla/2013/1.6-mehanika-sedan-id20398.html', // дописано

		// url= 'http://www.autonavigator.ru/reviews/Toyota/Corolla/34586.html',
		// url = 'http://www.autonavigator.ru/reviews/Toyota/Corolla/34864.html',
		// url = 'http://www.autonavigator.ru/reviews/Toyota/Corolla/35018.html',
			url = 'http://www.autonavigator.ru/reviews/Toyota/Corolla/35602.html',
			data = yield parseMan.getDataForParse(url);
		switch (resource[1]) {
			case 'infocar.ua':
				parseData = yield parseMan.parseDataInfocar(data);
				break;
			case 'autonavigator.ru':
				parseData = yield parseMan.parseDataAutonavigator(data);
				break;
			default:
				console.log('other resource!');
		}
		console.log(parseData);
	}



	//parse: function * (options) {
	//	console.log('test_controller - ' + options.count);
	//	yield parseMan.parse(options.count);
    //
	//	//request(url, function (error, response, body) {
	//	//	if (!error && response.statusCode == 200) {
	//	//		console.log('body - ', body); // Show the HTML for the Google homepage.
	//	//	}
	//	//})
    //
	//	request({
	//		url: url,
	//		encoding: null
	//	}, function(err, res, body){
	//		if(err)console.log(err);
	//		else{
	//			var $ = cheerio.load(translator.convert(body));
	//			var reviews = [];
	//			$('.description').each(function(){
	//				reviews.push({
	//					description: $('.description').text()
	//					//url:$('a',this).attr('href')
	//				});
	//			});
	//			$('.rates i').each(function(){
	//				var obj = {};
	//				obj[$('.rates i').text()] = $('.rates span').attr('title');
	//				reviews.push(obj);
	//				//reviews.push({
	//					//$('.rates i').text()[$('.rates').text()]
	//				//rates: $('.rates').text()
	//					//url:$('a',this).attr('href')
	//				//});
	//			});
	//			console.log('reviews - ', reviews);
	//		}
	//	});


};


