

/**
 * Load all external dependencies
 * We use var so it's global available : ) ( not let,const)
 */
var fs      = require('fs');
var _ = require('lodash');


/**
 * Load all internal dependencies
 */
const cfg     = require('../config.js');
var pkg     = require('../package.json');
var piJS     = require('./modules/pi-js-module');

let pi = new piJS(cfg);
