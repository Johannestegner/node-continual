var fs = require('fs');
(function (EIntervalType) {
    EIntervalType[EIntervalType["In"] = 0] = "In";
    EIntervalType[EIntervalType["At"] = 1] = "At";
})(exports.EIntervalType || (exports.EIntervalType = {}));
var EIntervalType = exports.EIntervalType;
var IntervalData = (function () {
    function IntervalData() {
    }
    IntervalData.prototype.deserialize = function (data) {
        if ('at' in data) {
            this.type = EIntervalType.At;
            this.at = data.at;
        }
        else if ('in' in data) {
            this.type = EIntervalType.In;
            this.in = data.in.value;
            this.unit = data.in.unit;
        }
        else {
            throw new Error('Occurrence was neither of the type At or In.');
        }
        this.once = data.once;
        return this;
    };
    return IntervalData;
})();
exports.IntervalData = IntervalData;
var NotifierData = (function () {
    function NotifierData() {
    }
    NotifierData.prototype.deserialize = function (data) {
        this.id = data.id;
        this.path = data.path;
        return this;
    };
    return NotifierData;
})();
exports.NotifierData = NotifierData;
var TaskData = (function () {
    function TaskData() {
        this.subTasks = new Array();
        this.notifiers = new Array();
    }
    TaskData.prototype.deserialize = function (data) {
        this.notifiers = data.notifiers;
        this.path = data.path;
        this.interval = new IntervalData().deserialize(data.interval);
        if (data.then !== undefined) {
            for (var i = 0, count = data.then.length; i < count; i++) {
                this.subTasks.push(new TaskData().deserialize(data.then[i]));
            }
        }
        return this;
    };
    return TaskData;
})();
exports.TaskData = TaskData;
var ConfigData = (function () {
    function ConfigData() {
        this.notifiers = new Array();
        this.jobs = new Array();
    }
    ConfigData.prototype.deserialize = function (data) {
        for (var i = 0, count = data.notifiers.length; i < count; i++) {
            this.notifiers.push(new NotifierData().deserialize(data.notifiers[i]));
        }
        for (var i = 0, count = data.jobs.length; i < count; i++) {
            this.jobs.push(new TaskData().deserialize(data.jobs[i]));
        }
        return this;
    };
    return ConfigData;
})();
exports.ConfigData = ConfigData;
function importConfig(filePath) {
    var data = fs.readFileSync(filePath, 'UTF8');
    return new ConfigData().deserialize(JSON.parse(data));
}
exports.importConfig = importConfig;
