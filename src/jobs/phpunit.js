
/**
 *
 * @constructor
 */
var PhpUnitJob = function PhpUnitJob() {
    this.exec = require('child_process').exec;
    this.command = 'phpunit';
};

/**
 * Run the job.
 * @param {function} callback Callback to fire on done: function(error, message, time) - where error should be undefined if no error and message is the message passed to the notifier.
 */
PhpUnitJob.prototype.runJob = function runJob(callback) {
    var start = (new Date().getTime());

    this.exec(this.command, function(error, stdout, stderr) {
        // Todo: Parse the output in a neater way.
        var split = stdout.split('\n');
        var outMessage = split[split.length - 2];

        if(split[split.length - 3] === 'FAILURES!' || split[split.length - 2].indexOf('OK') === -1) {
            outMessage = 'Failures in tests.';
            callback(outMessage, undefined,  (new Date().getTime()) - start);
        }
        callback(undefined, outMessage,  (new Date().getTime()) - start);
    });
};

/**
 * Fetch job name.
 * @returns {string} name
 */
PhpUnitJob.prototype.getName = function getName() { return 'phpunit'; };

/**
 * Fetch job version
 * @returns {string} Version as string ('x.x.x.x')
 */
PhpUnitJob.prototype.getVersion = function getVersion() { return '1.0.0.0'; };

module.exports = new PhpUnitJob();
