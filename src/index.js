#! /usr/bin/env node
process.title = 'Continual';
require('./array-functions.js');
var log = require('node-yolog');

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
            notifiers.asyncForEach(function(notifier, cb) {
                if(error) {
                    notifier.sendError(error, function() {
                        cb();
                    });
                } else {
                    notifier.sendSuccess(message, time, function() {
                        cb();
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
jobs.asyncForEach(function(job, d) {
    run(job.job, job.interval);
    d();
}, function() {
    log.info('All jobs started.');
});

