/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
var yolog = require('node-yolog');
var Notifier = require('./notifier');
var Data = require('./config-data');
var Task = require('./task');
var Continual = (function () {
    function Continual(configFile) {
        var data = Data.importConfig(configFile);
        yolog.info("Config loaded successfully. Setting up tasks and notifiers.");
        this.notifiers = new Array();
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            var notifier = new Notifier(data.notifiers[i]);
            this.notifiers.push(notifier);
            yolog.info('Loaded Notifier "%s" - v%s', notifier.getName(), notifier.getVersion());
        }
        yolog.info('Initialized %d notifiers.', this.notifiers.length);
        this.tasks = new Array();
        for (var i = 0, count = data.tasks.length; i < count; i++) {
            var task = new Task(data.tasks[i], this);
            this.tasks.push(task);
            yolog.info('Loaded Task "%s" - v%s. (total of %d sub-tasks).', task.getName(), task.getVersion(), task.getSubtaskCount());
        }
        yolog.info('Intialized %d Tasks.', this.tasks.length);
    }
    Continual.prototype.getNotifier = function (id) {
        return this.notifiers.find(function (item, index, list) {
            return item.getId() === id;
        });
    };
    Continual.prototype.start = function () {
        for (var i = 0, count = this.tasks.length; i < count; i++) {
            this.tasks[i].run(undefined);
        }
        yolog.info('All tasks started.');
    };
    return Continual;
})();
module.exports = Continual;
