var Notifier = require('./notifier');
var Data = require('./config-data');
var Task = require('./task');
var Structures = require('./helpers/structures');
var CommandTypes = (function () {
    function CommandTypes() {
    }
    CommandTypes.DEBUG = new Structures.KvP('debug', 'Debug, will display more output.');
    CommandTypes.INIT = new Structures.KvP('init', 'Initialize continual in current directory.');
    CommandTypes.HELP = new Structures.KvP('help', 'Show this command list.');
    return CommandTypes;
})();
exports.CommandTypes = CommandTypes;
var Continual = (function () {
    function Continual(configFile) {
        var data = Data.importConfig(configFile);
        yolog.info("Config loaded successfully. Setting up jobs and notifiers.");
        this.notifiers = new Array();
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            this.notifiers.push(new Notifier(data.notifiers[i]));
        }
        yolog.info('Initialized %d notifiers.', this.notifiers.length);
        this.tasks = new Array();
        for (var i = 0, count = data.jobs.length; i < count; i++) {
            this.tasks.push(new Task(data.jobs[i], this));
        }
        yolog.info('Intialized %d Jobs/Tasks.', this.tasks.length);
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
exports.Continual = Continual;
