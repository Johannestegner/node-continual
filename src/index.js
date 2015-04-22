#! /usr/bin/env node
process.title = 'Continual';
require('./array-functions.js');
var log     = require('node-yolog');
var fs      = require('fs');
var util    = require('util');

var eol = process.platform === 'win32' ? '\r\n' : '\n';
var continualDir = '.continual';
var jobs = [];
var notifiers = [];

var init = process.argv.find(function(element, index, array) {
    return element.indexOf('-init') !== -1;
});
var help = process.argv.find(function(element, index, array) {
   return element.indexOf('-commands') !== -1;
});

if(help) {

    console.log('Commands:');
    console.log('\t-commands\tShows this command list.');
    console.log('\t-init    \tInitializes continual in current directory.');

    process.kill();
}

if(init) {
    log.info('Initializing .continual in current directory.');

    if(fs.existsSync(continualDir)) {
        log.error('There is already a %s directory in this directory. Please use that one or remove it and run init command again.', continualDir);
    } else {
        fs.mkdirSync(continualDir);
        if(!fs.existsSync(continualDir)) {
            log.error('Failed to create continual directory.');
        } else {
            var file = util.format('{%s\t"notifiers": [],%s\t"jobs": []%s}', eol, eol, eol);
            fs.writeFileSync(continualDir + '/config.json', file, 'UTF8');
            if(!fs.existsSync(continualDir + '/config.json')) {
                log.error('Failed to create config file.');
            }
            fs.mkdir('jobs');
            fs.mkdir('notifiers');
        }
    }
    process.kill();
} else {
    if(!fs.existsSync(continualDir) || !fs.existsSync(continualDir + '/config.json')) {
        log.error('Failed to locate continual files in directory. Have you initialized continual?');
        log.info('Type `continual -commands` for commands.');
        process.kill();
    }
}

// Read config file.
var config = require(process.cwd() + '/' + continualDir + '/config.json', 'UTF8');

if(config.jobs.length === 0 || config.notifiers.length === 0) {
    log.error('Jobs and Notifiers can not be empty.');
    process.kill();
}

// Fetch the notifier to use.
config.notifiers.asyncMap(function(notifierData, next) {
    var notifier = require(process.cwd() + '/' + continualDir + '/' + notifierData);
    log.info("Loaded notifier: %s (%s)", notifier.getName(), notifier.getVersion());
    next(notifier);
}, function(result) {
    notifiers = result;
    log.debug('All (%d) notifiers loaded.', notifiers.length);
});

// Fetch the jobs to use.
config.jobs.asyncMap(function(jobData, next) {
    var job = {
        'job': require(process.cwd() + '/' + continualDir + '/' + jobData.path)
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

