function OSXTerminal() {
    this.exec = require('child_process').exec;
    // TODO: Use osascript instead?
    // this.messageStr = "osascript -e 'display notification \"%s\" with title \"Tests done.\"'";
    // this.errorStr = "osascript -e 'display notification \"%s\" with title \"Tests failed.\"' sound name \"Sosumi\"";
}


OSXTerminal.prototype.sendError = function sendError(str, callback) {
    this.exec("terminal-notifier -message \"" + str + "\" -sound Sosumi -title \"Build Error\" -group BuilderErr");


};
OSXTerminal.prototype.sendSuccess = function sendSuccess(str, time, callback) {
    var fullMessage = str + " - " + " (" + (time / 1000) + " s)";
    // Todo: Use a generic notifier interface, not hard-coded 'terminal-notifier'.
    this.exec("terminal-notifier -message \"" + fullMessage + "\" -title \"Build Done\" -group BuilderMsg", callback);
};

OSXTerminal.prototype.name = function name() {
    return 'OSXTerminal';
};

module.exports = new OSXTerminal();
