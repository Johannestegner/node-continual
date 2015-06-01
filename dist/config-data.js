var fs = require('fs');
(function (EIntervalType) {
    EIntervalType[EIntervalType["In"] = 0] = "In";
    EIntervalType[EIntervalType["At"] = 1] = "At";
})(exports.EIntervalType || (exports.EIntervalType = {}));
var EIntervalType = exports.EIntervalType;
/**
 * IntervalData.
 * Data object containing information about a interval.
 */
var IntervalData = (function () {
    /**
     * IntervalData constructor.
     * Creates a IntervalData object.
     * A IntervalData object should be deserailized before usage, so that
     * its fields are populated.
     * This should be handeled internally by the TaskData object.
     * @see TaskData
     * @see deserialize
     * @see Serializable<T>
     */
    function IntervalData() {
        // Nothing is currently done in the IntervalData constructor.
    }
    /**
     * Deserialize a raw json config object (part containing interval data)
     * and populate the IntervalData fields.
     * @param {object} data Json data.
     * @returns {IntervalData} this.
     */
    IntervalData.prototype.deserialize = function (data) {
        var strType = data.type;
        this.type = EIntervalType[strType.toLowerCase()];
        if (this.type === 0 /* In */) {
            this.in = data.in;
            this.unit = data.unit;
        }
        else if (this.type === 1 /* At */) {
            this.at = data.at;
        }
        this.once = data.once;
        return this;
    };
    return IntervalData;
})();
exports.IntervalData = IntervalData;
/**
 * NotifierData.
 * Data object containing information about a notifier.
 */
var NotifierData = (function () {
    /**
     * NotifierData constructor.
     * Creates a NotifierData object.
     * A NotifierData object should be deserialized before usage, so that
     * its fields are populated.
     * This should be handeled internally by the ConfigData object.
     * @see ConfigData
     * @see deserialize
     * @see Serializable<T>
     */
    function NotifierData() {
        // Nothing is currently done int the NotiferData constructor.
    }
    /**
     * Deserialize a raw json config object (part containing notifier data)
     * and populate the NotifierData fields.
     * @param {object} data Json data.
     * @returns {NotifierData} this.
     */
    NotifierData.prototype.deserialize = function (data) {
        this.id = data.id;
        this.path = data.path;
        return this;
    };
    return NotifierData;
})();
exports.NotifierData = NotifierData;
/**
 * TaskData.
 * Data object containing information about a task and its sub-tasks.
 */
var TaskData = (function () {
    /**
     * TaskData constructor.
     * Creates a TaskData object.
     * A TaskData object should be deserialized before usage, so that
     * its fields are populated.
     * This should be handeled internally by the ConfigData object.
     * @see ConfigData
     * @see deserialize
     * @see Serializable<T>
     */
    function TaskData() {
        this.subTasks = new Array();
        this.notifiers = new Array();
    }
    /**
     * Deserialize a raw json config object (part contianing task data)
     * and populate the TaskData fields.
     * @param {object} data Json data.
     * @returns {TaskData} this.
     */
    TaskData.prototype.deserialize = function (data) {
        this.notifiers = data.notifiers;
        this.path = data.path;
        this.interval = new IntervalData().deserialize(data.interval);
        // Check if any subtasks under the 'then' property.
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
/**
 * ConfigData.
 * Contains all information about the configuration for the current continual instance.
 * Used mainly as a forced converter to structure so that its certain that some properties
 * exists.
 * The config data object creates all its sub-objects inside, so no need to do this manually.
 */
var ConfigData = (function () {
    /**
     * ConfigData constructor.
     * Creates a config data object.
     * A configData object should be deserialized before usage, so that
     * its fields are populated.
     * @see deserialize
     * @see Serializable<T>
     */
    function ConfigData() {
        this.notifiers = new Array();
        this.jobs = new Array();
    }
    /**
     * Deserialize a raw json config object and populate the ConfigData fileds.
     * @param {object} data Json data.
     * @returns {ConfigData} this.
     */
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
/**
 * Import config.
 * @param {string} filePath Path to the configuration file.
 * @returns {ConfigData} A loaded configuration object.
 */
function importConfig(filePath) {
    var data = fs.readFileSync(filePath, 'UTF8');
    return new ConfigData().deserialize(JSON.parse(data));
}
exports.importConfig = importConfig;
