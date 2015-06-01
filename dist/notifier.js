var Util = require('util');
// Currently the notifier object is mainly a script loader whith a id.
// It could just as well be a dictionary.
// But in the future it might be used for other stuff too, so I decided to
// have it as its own class.
/**
 * The Notifier object implements the INotifier interface and passes the calls to the script.
 */
var ContinualNotifier = (function () {
    /**
     * ContinualNotifier constructor.
     * Creates and initializes a notifier object.
     * @param {NotifierData} data Data to create the notifier from.
     */
    function ContinualNotifier(data) {
        // Set up path to the actual file
        var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
        // Load it.
        this.script = require(path);
        this.id = data.id;
    }
    /**
   * Get the ID of the notifier.
   * The ID is app specific, and set in the settings file.
   * Later used in the Jobs to fetch the correct notifier from the continual object.
   * @returns {string} Id.
   */
    ContinualNotifier.prototype.getId = function () {
        return this.id;
    };
    /**
     * Get the name of the notifier.
     * @returns {string} Name.
     */
    ContinualNotifier.prototype.getName = function () {
        return this.script.getName();
    };
    /**
     * Get the notifier version.
     * @returns {string} Version.
     */
    ContinualNotifier.prototype.getVersion = function () {
        return this.script.getVersion();
    };
    /**
     * Send error message to notifier.
     * @param {string} error Error message.
     * @param {function} done Callback to fire on done: function(void) => void.
     */
    ContinualNotifier.prototype.sendError = function (error, done) {
        this.script.sendError(error, done);
    };
    /**
     * Send success message to notifier.
     * @param {string} message Message to pass to notifier.
     * @param {number} time Time the job took.
     * @param {function} done Callback to fire on done: function(void) => void.
     */
    ContinualNotifier.prototype.sendSuccess = function (message, time, done) {
        this.script.sendSuccess(message, time, done);
    };
    /**
     * Send message to notifier.
     * @param {string} message Message to send.
     * @param {function} done Callback to fire on done: function(void) => void.
     */
    ContinualNotifier.prototype.sendMessage = function (message, done) {
        this.script.sendMessage(message, done);
    };
    return ContinualNotifier;
})();
module.exports = ContinualNotifier;
