var Util = require('util');
var Interval = require('./interval');
var ContinualTask = (function () {
    function ContinualTask(data, continual) {
        var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
        this.script = require(path);
        this.subTasks = new Array();
        this.notifiers = new Array();
        for (var i = 0, count = data.subTasks.length; i < count; i++) {
            this.subTasks.push(new ContinualTask(data.subTasks[i], continual));
        }
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            var notifier = continual.getNotifier(data.notifiers[i]);
            if (!notifier) {
                yolog.info('Failed to fetch a notifier for job with name: %s. Id did not exist in the notifier list.', this.script.getName());
            }
            else {
                this.notifiers.push(notifier);
            }
        }
        this.interval = new Interval.Interval(data.interval);
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
                    yolog.debug('Done calling sub-tasks. Resetting timer.');
                    done();
                });
            });
        });
    };
    ContinualTask.prototype.run = function (callback) {
        yolog.info('Starting the task named "%s". Will run in: %d seconds.', this.getName(), (this.interval.getNext() / 1000));
        var self = this;
        setTimeout(function () {
            self.runJob(function () {
                if (callback) {
                    callback();
                }
                else {
                    self.run(undefined);
                }
            });
        }, this.interval.getNext());
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
    return ContinualTask;
})();
exports.ContinualTask = ContinualTask;
