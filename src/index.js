#! /usr/bin/env node
process.title = 'phpunit-scheduler';

require('./pollyfills.js');

var exec   = require('child_process').exec;
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
var notifier = require('./' + config.notifier);

var runTest = function runTest(callback) {

    exec('phpunit', function(error, stdout, stderr) {
        // Todo: Parse the output in a neater way.
        var split = stdout.split('\n');
        var outMessage = split[split.length - 2];

        if(split[split.length - 3] === 'FAILURES!') {
            log.error(stdout);
            notifier.sendError("Failures in build.")
        }

        callback(outMessage);
    });

};

var run = function run() {
    var handle = setInterval(function() {
        var start = (new Date().getTime());

        log.info('Starting a test...');
        clearInterval(handle);
        runTest(function(message) {
            var stop = (new Date().getTime());
            var diff = stop - start;
            log.debug(message);
            notifier.sendSuccess(message, diff, function() {

                log.info('Test done...');
                log.info('Restarting interval.');
                run();
            });
        });
    },  interval * 60 * 1000);
};

run();
log.info("Loaded scheduler with interval %d (minutes) and notifier %s", interval, notifier.name());
