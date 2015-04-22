#! /usr/bin/env node
process.title = 'Continual';
require('./array-functions.js');
var log = require('node-yolog');
var config = require('./../config.json');
var jobs = [];
var notifiers = [];


// Fetch the notifier to use.
config.notifiers.asyncMap(function(notifierData, next) {
    var notifier = require(notifierData);
    log.info("Loaded notifier: %s (%s)", notifier.getName(), notifier.getVersion());
    next(notifier);
}, function(result) {
    notifiers = result;
    log.debug('All (%d) notifiers loaded.', notifiers.length);
});

// Fetch the jobs to use.
config.jobs.asyncMap(function(jobData, next) {
    var job = {
        'job': require(jobData.path)
        , 'interval': jobData.interval
    };
    log.info('Loaded job: %s (%s) - Interval: %d', job.job.getName(), job.job.getVersion(), job.interval);
    next(job);
}, function(result) {
    jobs = result;
    log.debug('All (%d) jobs loaded.', jobs.length);
});

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

