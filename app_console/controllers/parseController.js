"use strict";

const parseMan = require('../managers/parseManager');
var request = require('request'),
	Q = require("q"),
	cheerio = require('cheerio'),
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

		request(url, function(err, res, body){
			if(err)console.log(err);
			else{
				$ = cheerio.load(body);
				var cards = [];
				$('.card').each(function(){
					cards.push({
						title:$('.title',this).text(),
						url:$('a',this).attr('href')
					});
				});
			}
			console.log('cards - ', cards);
		});


	}

};


