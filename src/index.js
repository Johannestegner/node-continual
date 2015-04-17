#! /usr/bin/env node
process.title = 'phpunit-scheduler';

require('./pollyfills.js');

var async   = require('async');
var exec    = require('child_process').exec;
var log     = require('node-yolog');


var editArg = process.argv.find(function(element, index, array) {
    return element.indexOf('-edit') !== -1;
});

if(editArg) {
    log.info('Open config.json to edit settings.');
    process.kill();
}

var interval = 5;
var intervalArg = process.argv.find(function(element, index, array) {
    return element.indexOf('-interval') !== -1;
});
if(intervalArg) {
    intervalArg = intervalArg.split('=');
    interval = intervalArg[intervalArg.length - 1];
}

// Fetch the notifier to use.
var config = require('./../config.json');
var notifiers = [];
for(var i= 0,c=config.notifiers.length;i<c;i++) {
    notifiers.push(require(config.notifiers[i]));
}

/**
 * Run the test (phpunit) in current dir.
 * @param {function} callback Callback to fire when done: function(message).
 */
var runTest = function runTest(callback) {

    exec('phpunit', function(error, stdout, stderr) {
        // Todo: Parse the output in a neater way.
        var split = stdout.split('\n');
        var outMessage = split[split.length - 2];

        if(split[split.length - 3] === 'FAILURES!') {
            log.error(stdout);
            notifiers.forEach(function(notifier) {
                notifier.sendError("Failures in build.")
            });
        }
        callback(outMessage);
    });

};

/**
 * Run the application 'loop'.
 */
var run = function run() {
    var handle = setInterval(function() {
        var start = (new Date().getTime());

        log.info('Starting a test...');
        clearInterval(handle);
        runTest(function(message) {
            var stop = (new Date().getTime());
            var diff = stop - start;
            log.debug(message);
            async.each(notifiers, function(notifier, next) {
                notifier.sendSuccess(message, diff, function() {
                    next();
                });
            }, function() {
                log.info('Notifiers notified.');
                log.info('Waiting for %s minutes, then running tests again.', interval);
                run();
            });


        });
    },  interval * 60 * 1000);
};

run();
log.info("Loaded scheduler with interval %d (minutes) and the following notifiers: ");
for(var j= 0,q=notifiers.length;j<q;j++) {
    log.info("%s (%s)", notifiers[j].getName(), notifiers[j].getVersion());
}
