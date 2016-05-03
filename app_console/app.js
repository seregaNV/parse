"use strict";

/**
 * @deprecated Автор optimist отказался от его подержки в пользу minimist
 */
let argv = require('optimist')
    .usage('Usage: $0 --section [string] [--action [string]] [--opt [object]]')
    .demand(['section'])
    .options('parse', {
        'default' : 'parse'
    })
    .options('opt', {
        alias : 'options',
        'default' : {},
        description : 'example --opt.app=mobile --opt.s=1'
    })
        .argv;

let co = require('co');

var onerror = function onerror(err) { console.error(err.stack); };

// @description Вызов обработчика с заданными в argv.opt параметрами
co(function *(){
    yield require('./controllers/'+argv.section+'Controller')[argv.parse](argv.opt);
    //process.exit(0);
}).catch(onerror);