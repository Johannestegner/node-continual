var Util = require('util');
var ContinualNotifier = (function () {
    function ContinualNotifier(data) {
        var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
        this.script = require(path);
        this.id = data.id;
    }
    ContinualNotifier.prototype.getId = function () {
        return this.id;
    };
    ContinualNotifier.prototype.getName = function () {
        return this.script.getName();
    };
    ContinualNotifier.prototype.getVersion = function () {
        return this.script.getVersion();
    };
    ContinualNotifier.prototype.sendError = function (error, done) {
        this.script.sendError(error, done);
    };
    ContinualNotifier.prototype.sendSuccess = function (message, time, done) {
        this.script.sendSuccess(message, time, done);
    };
    ContinualNotifier.prototype.sendMessage = function (message, done) {
        this.script.sendMessage(message, done);
    };
    return ContinualNotifier;
})();
exports.ContinualNotifier = ContinualNotifier;
