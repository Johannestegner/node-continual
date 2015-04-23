var util = require('util');

/**
 * Wrapper for jobs.
 */
function JobRunner(data, baseDir) {
    
    var _self = this;
    var _jobPath = util.format('%s/%s/%s', process.cwd(), baseDir, data.path);
    var _job = require(_jobPath);
    var _interval = data.interval;
    var _hInt = null;
    var _stopped = false;
    
    /**
     * Get name of the current job.
     * @param {string} Name.
     */
    this.getName = function getName() {
        return _job.getName();
    }
    
    /**
     * Get current job version.
     * @param {string} Version. 
     */
    this.getVersion = function getVersion() {
        return _job.getVersion();
    }
    
    /**
     * Get job interval.
     * @returns {int} Interval in minutes.
     */
    this.getInterval = function getInterval() {
        return _interval;
    };
    
    /**
     * Internal job loop.
     */
    var _run = function _run() {
        if (_stopped) {
            return;
        }
        _hInt = setInterval(function () {
            // Tick!  Clear the interval, cause we don't want to start the job-timer till after its done.
            clearInterval(_hInt);
            // Run the actual job...
            _job.runJob(function (error, message, time) {
                // Job is done, alert notifiers.
                notifiers.asyncForEach(function (notifier, cb) {
                    if (error) {
                        notifier.sendError(error, cb);
                    } else {
                        notifier.sendSuccess(message, time, cb);
                    }
                }, function () {
                    // All notifiers alerted, re-start the job!
                    _run();
                });
            });
        }, _interval * 1000 * 60);
    };
    
    /**
     * Run a job loop.
     */
    this.run = function run() {
        log.info('Starting the job %s.', _self.getName());
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