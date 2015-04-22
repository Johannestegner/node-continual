/**
 * This file should only be used as a informational file showing the interface that is used
 * for jobs.
 */

/**
 *
 * @constructor
 */
var JobInterface = function JobInterface() { };

/**
 * Run the job.
 * @param {function} callback Callback to fire on done: function(error, message, time) - where error should be undefined if no error and message is the message passed to the notifier.
 */
JobInterface.prototype.runJob = function runJob(callback) { callback('Not implemented.', undefined, 0.0); };

/**
 * Fetch job name.
 * @returns {string} name
 */
JobInterface.prototype.getName = function getName() { return ''; };

/**
 * Fetch job version
 * @returns {string} Version as string ('x.x.x.x')
 */
JobInterface.prototype.getVersion = function getVersion() { return '0.0.0.0'; };
