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
    var _stopped    = false;
    var _subTasks   = [];
    
    if (data.then !== undefined) {
        data.then.forEach(function (taskData) {
            _subTasks.push(new JobRunner(taskData, baseDir, continual));
        });
    }
    
    /**
     * Get number of subtasks this given job have.
     * @returns {number} Subtask count.
     */
    this.subTaskCount = function subTaskCount() {
        return _subTasks.length;
    }

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
     * Run a job loop.
     */
    this.run = function run() {
        log.debug('Run invoked. Will run the job %s.', _self.getName());
        if (_stopped) {
            log.debug('Job has been stopped. Will not continue.');
            return;
        }

        _self.runOnce(function () {
            log.debug('Job (and all subtasks) done. Restarting loop.');
            _self.run();
        });
    };
    
    /**
     * Run a job once.
     */
    this.runOnce = function runOnce(callback) {
        log.debug('Run once invoked. Will run the job in %d ms.', _interval.getNext());
        setTimeout(function () {
            log.debug('Running the job %s once.', _self.getName());
            
            // Run the actual job.
            _job.runJob(function (error, message, time) {
                log.debug('Job was done. Has error? %s. Time it took: %d ms.', (error !== undefined), time);
                _continual.notifiers.asyncForEach(function (notifier, cb) {
                    log.debug('Alerting notifier %s.', notifier.getName());
                    if (error) {
                        notifier.sendError(error, cb);
                    } else {
                        notifier.sendSuccess(message, time, cb);
                    }
                }, function () {
                    log.debug('Running all subtasks.');
                    _subTasks.asyncForEach(function (subTask, cb) {
                        subTask.runOnce(cb);
                    }, function () {
                        callback();
                    });
                });
            });

        }, _interval.getNext());
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
