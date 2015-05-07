var Notifier = require('./notifier');
var Data = require('./config-data');
var Task = require('./task');
var _commands = {
    'init': 'Initialize continual in current directory.',
    'help': 'Show this command list.',
    'd': 'Debug, will display more output.'
};
var ArgumentTypes = (function () {
    function ArgumentTypes() {
    }
    ArgumentTypes.getDescription = function (type) {
        return _commands[type];
    };
    ArgumentTypes.DEBUG = 'd';
    ArgumentTypes.INIT = 'init';
    ArgumentTypes.HELP = 'help';
    ArgumentTypes.length = 3;
    return ArgumentTypes;
})();
exports.ArgumentTypes = ArgumentTypes;
var Continual = (function () {
    function Continual(configFile) {
        var data = Data.importConfig(configFile);
        yolog.info("Config loaded successfully. Setting up jobs and notifiers.");
        this.notifiers = new Array();
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            this.notifiers.push(new Notifier.ContinualNotifier(data.notifiers[i]));
        }
        this.tasks = new Array();
        for (var i = 0, count = data.jobs.length; i < count; i++) {
            this.tasks.push(new Task.ContinualTask(data.jobs[i], this));
        }
        for (var i = 0, count = this.tasks.length; i < count; i++) {
            this.tasks[i].run(undefined);
        }
    }
    Continual.prototype.getNotifier = function (id) {
        return this.notifiers.find(function (item, index, list) {
            return item.getId() === id;
        });
    };
    return Continual;
})();
exports.Continual = Continual;
