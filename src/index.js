#! /usr/bin/env node
process.title = 'Continual';
// Require and set up globals and polyfill/s.
require('./array-functions.js');

var log = require('node-yolog');
var Continual = require('./Continual.js');
// Attach the logger to the global object.
global.log = log;

// Set up the continual object used.
var continual = new Continual();

/**
 * Fetch an argument from the argv list.
 * @returns {undefined|string} The argument, if found, or undefined.
 */
var getArg = function getArg(command) {
    return process.argv.find(function (element, index, array) {
        return element.indexOf(command) !== -1;
    });
}

/**
 *  List of valid arguments.
 */
var Arguments = {
    'DEBUG' : '-d',
    'INIT'  : '-init',
    'HELP'  : '-help'
};

// If debug flag is not on, hide all 'debug', 'trace' and 'todo' output.
// Users dont need the debug output.
if (getArg(Arguments.DEBUG) === undefined) {
    log.set(false, 'debug', 'trace', 'todo');
}
log.debug('Debug is on.');

if (getArg(Arguments.HELP) !== undefined) {
    continual.help(); // User invoked the help command. Show help then exit.
} else if (getArg(Arguments.INIT) !== undefined) {
    continual.init(); // User invoked the init command. Initialize continual, then exit.
} else {
    // If no command was found, run continual if possible.
    if (continual.load()) {
        log.info("Continual loaded and ready. Starting jobs.");
        continual.jobs.asyncForEach(function (job, d) {
            job.run();
            d();
        }, function () {
            log.info('All jobs started.');
        });
    }
}
