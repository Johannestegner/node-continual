var TimedEntry = require('./TimedEntry.js');
var util = require('util');

/**
 * Wrapper for jobs.
 * @param {object} data Data object for job: { 'path': 'path/to/the/job/script.js', 'interval' { 'value': number, unit: 'unit' };
 * @param {string} baseDir Base directory of the continual instance.
 * @param {Continual} continual The continual parent object.
 */
function JobRunner(data, baseDir, continual) {
    
    var _self       = this;
    var _continual  = continual;
    var _jobPath    = util.format('%s/%s/%s', process.cwd(), baseDir, data.path);
    var _job        = require(_jobPath);
    var _interval   = new TimedEntry(data.interval);
    var _hInt       = null;
    var _stopped    = false;
    
    /**
     * Get name of the current job.
     * @returns {string} Name.
     */
    this.getName = function getName() {
        return _job.getName();
    };
    
    /**
     * Get current job version.
     * @returns {string} Version. 
     */
    this.getVersion = function getVersion() {
        return _job.getVersion();
    };
    
    /**
     * Get job interval.
     * @returns {int} Interval in ms.
     */
    this.getInterval = function getInterval() {
        return _interval.getNext();
    };
    
    /**
     * Internal job loop.
     */
    var _run = function _run() {
        if (_stopped) {
            log.debug('Job has been stopped. Will not continue.');
            return;
        }
        _hInt = setInterval(function () {
            log.debug('Running the task.');
            // Tick!  Clear the interval, cause we don't want to start the job-timer till after its done.
            clearInterval(_hInt);
            // Run the actual job...
            _job.runJob(function (error, message, time) {
                log.debug('Job was done. Has error? %s. Time it took: %d ms.', (error !== undefined), time);
                // Job is done, alert notifiers.
                _continual.notifiers.asyncForEach(function (notifier, cb) {
                    log.debug('Alerting notifier %s.', notifier.getName());
                    if (error) {
                        notifier.sendError(error, cb);
                    } else {
                        notifier.sendSuccess(message, time, cb);
                    }
                }, function () {
                    log.debug('All notifiers have been notified. Restarting loop!');
                    // All notifiers alerted, re-start the job!
                    _run();
                });
            });
        }, _interval.getNext());
    };
    
    /**
     * Run a job loop.
     */
    this.run = function run() {
        log.debug('Starting the job %s.', _self.getName());
        _run();
    };
    
    /**
     * Stop the job.
     */
    this.stop = function stop() {
        log.info('The job "%s" has been stopped. If its currently in the midle of a job, this will finish first.', _self.getName());
        _stopped = true;
        clearInterval(_hInt);
    };
}

module.exports = JobRunner;
