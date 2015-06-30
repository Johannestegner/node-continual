/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
var yolog = require('node-yolog');
var Data = require('./config-data');
var Util = require('util');
var OccurrenceAt = require('./occurrences/at');
var OccurrenceIn = require('./occurrences/in');
var ContinualTask = (function () {
    function ContinualTask(data, continual) {
        this.parent = null;
        var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
        this.script = require(path);
        this.subTasks = new Array();
        this.notifiers = new Array();
        for (var i = 0, count = data.subTasks.length; i < count; i++) {
            var subtask = new ContinualTask(data.subTasks[i], continual);
            subtask.parent = this;
            this.subTasks.push(subtask);
        }
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            var notifier = continual.getNotifier(data.notifiers[i]);
            if (!notifier) {
                yolog.info('Failed to fetch a notifier (id: %d) for task with name: %s. Id did not exist in the notifier list.', data.notifiers[i], this.script.getName());
            }
            else {
                this.notifiers.push(notifier);
            }
        }
        if (data.interval.type === Data.EIntervalType.At) {
            this.occurrence = new OccurrenceAt(data.interval);
        }
        else if (data.interval.type === Data.EIntervalType.In) {
            this.occurrence = new OccurrenceIn(data.interval);
        }
    }
    ContinualTask.prototype.runJob = function (done) {
        var self = this;
        yolog.debug('Run job invoked.');
        this.script.runJob(function (error, message, time) {
            self.notifiers.asyncForEach(function (notifier, next) {
                yolog.debug('Sending result to notifier named %s', notifier.getName());
                if (error) {
                    notifier.sendError(error, function () { next(); });
                }
                else {
                    notifier.sendSuccess(message, time, function () { next(); });
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
                        yolog.info('The task %s is done running.', self.getName());
                        yolog.debug('Done calling sub-tasks. Resetting timer.');
                    }
                    done();
                });
            });
        });
    };
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
                    if (!self.occurrence.isOnce()) {
                        self.run(undefined);
                    }
                }
            });
        }, next);
    };
    ContinualTask.prototype.getName = function () {
        return this.script.getName();
    };
    ContinualTask.prototype.getVersion = function () {
        return this.script.getVersion();
    };
    ContinualTask.prototype.getDescription = function () {
        return this.script.getDescription();
    };
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
