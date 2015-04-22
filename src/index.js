#! /usr/bin/env node
process.title = 'Continual';

require('./pollyfills.js');

var async   = require('async');
var log     = require('node-yolog');


var editArg = process.argv.find(function(element, index, array) {
    return element.indexOf('-edit') !== -1;
});

if(editArg) {
    log.info('Open config.json to edit settings.');
    process.kill();
}

// Fetch the notifier to use.
var config = require('./../config.json');
var notifiers = [];
for(var i= 0,c=config.notifiers.length;i<c;i++) {
    var notifier = require(config.notifiers[i]);
    notifiers.push(notifier);
    log.info("Loaded notifier: %s (%s)", notifier.getName(), notifier.getVersion());
}
// Fetch jobs.
var jobs = [];
for(var k= 0,c2=config.jobs.length;k<c2;k++) {
    var job = {
        'job': require(config.jobs[k].path)
        , 'interval': config.jobs[k].interval
    };
    jobs.push(job);
    log.info('Loaded job: %s (%s) - Interval: %d', job.job.getName(), job.job.getVersion(), job.interval);
}

/**
 * Run a job loop.
 * @param {object} job job to run (need to implement the job-interface).
 * @param {int} interval Interval to run the job at (in minutes).
 */
var run = function run(job, interval) {
    var handle = setInterval(function() {

        log.info('Starting %s...', job.getName());
        clearInterval(handle);
        job.runJob(function(error, message, time) {

            async.each(notifiers, function(notifier, next) {
                if(error) {
                    notifier.sendError(error, function() {
                        next();
                    });
                } else {
                    notifier.sendSuccess(message, time, function() {
                        next();
                    });
                }
            }, function() {
                log.info('%s Completed in %d s.', job.getName(), (time / 1000));
                log.info('Waiting for %s minutes, then running job again.', interval);
                run(job, interval);
            });

        });

    },  interval * 60 * 1000);
};


log.info("Continual loaded and ready. Starting jobs.");
jobs.forEach(function(job) {
    run(job.job, job.interval);
});

