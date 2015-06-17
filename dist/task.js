/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
var yolog = require('node-yolog');
var Data = require('./config-data');
var Util = require('util');
var OccurrenceAt = require('./occurrences/at');
var OccurrenceIn = require('./occurrences/in');
/**
 * The Task class implements the ITask and passes the calls to the script.
 */
var ContinualTask = (function () {
    /**
     * ContinualTask constructor.
     * Creates and initializes a continual task.
     * @param {JobData} data Data to set up the task with.
     * @param {Continual} continual Continual main object.
     */
    function ContinualTask(data, continual) {
        this.parent = null;
        // Set up path to the actual script file
        var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
        // Load it.
        this.script = require(path);
        // Initialize subtask and notifier arrays.
        this.subTasks = new Array();
        this.notifiers = new Array();
        for (var i = 0, count = data.subTasks.length; i < count; i++) {
            var subtask = new ContinualTask(data.subTasks[i], continual);
            subtask.parent = this;
            this.subTasks.push(subtask);
        }
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            // Fetch notifier from the continual object.
            var notifier = continual.getNotifier(data.notifiers[i]);
            if (!notifier) {
                yolog.info('Failed to fetch a notifier (id: %d) for task with name: %s. Id did not exist in the notifier list.', data.notifiers[i], this.script.getName());
            }
            else {
                // If it exists, add it to the jobs notifiers.
                this.notifiers.push(notifier);
            }
        }
        // Create the occurrence object.
        if (data.interval.type === 1 /* At */) {
            this.occurrence = new OccurrenceAt(data.interval);
        }
        else if (data.interval.type === 0 /* In */) {
            this.occurrence = new OccurrenceIn(data.interval);
        }
    }
    /**
     * Run the job.
     * @param {function} Callback on job done: function(void) => void;
     */
    ContinualTask.prototype.runJob = function (done) {
        // Run the main job script.
        var self = this;
        yolog.debug('Run job invoked.');
        this.script.runJob(function (error, message, time) {
            // The primary script is done, report to the notifiers.
            self.notifiers.asyncForEach(function (notifier, next) {
                yolog.debug('Sending result to notifier named %s', notifier.getName());
                if (error) {
                    notifier.sendError(error, function () {
                        next();
                    });
                }
                else {
                    notifier.sendSuccess(message, time, function () {
                        next();
                    });
                }
            }, function () {
                yolog.debug('All notifiers notifierd for the job %s', self.getName());
                yolog.debug('Calling sub-tasks.');
                self.subTasks.asyncForEach(function (task, next) {
                    task.run(function () {
                        next();
                    });
                }, function () {
                    if (!self.parent) {
                        yolog.info('The task %s and potential subtasks are done running.', self.getName());
                        yolog.debug('Done calling sub-tasks. Resetting timer.');
                    }
                    done();
                });
            });
        });
    };
    /**
     * Start the job loop.
     * @param {function} Callback to fire when done (or undefined): function(void) => void;
     */
    ContinualTask.prototype.run = function (callback) {
        var next = this.occurrence.getNext();
        yolog.info('Running the task "%s"%s in %d seconds.', this.getName(), (this.parent !== null ? ' (Sub-task of "' + this.parent.getName() + '")' : ''), (next / 1000));
        var self = this;
        setTimeout(function () {
            self.runJob(function () {
                if (callback) {
                    callback();
                }
                else {
                    if (!self.occurrence.isOnce) {
                        // call itself, so that the timer restarts
                        self.run(undefined);
                    }
                }
            });
        }, next);
    };
    /**
    * Get name of the job.
    * @returns {string} Name.
    */
    ContinualTask.prototype.getName = function () {
        return this.script.getName();
    };
    /**
     * Get job Version.
     * @returns {string} Version.
     */
    ContinualTask.prototype.getVersion = function () {
        return this.script.getVersion();
    };
    /**
     * Get job Description.
     * @returns {string} Description.
     */
    ContinualTask.prototype.getDescription = function () {
        return this.script.getDescription();
    };
    /**
     * Get the Tasks sub-task count (including sub-tasks tasks).
     * @returns {number} Total count of tasks under the given task.
     */
    ContinualTask.prototype.getSubtaskCount = function () {
        var total = this.subTasks.length;
        for (var i = 0, count = this.subTasks.length; i < count; i++) {
            total += this.subTasks[i].getSubtaskCount();
        }
        return total;
    };
    return ContinualTask;
})();
module.exports = ContinualTask;
