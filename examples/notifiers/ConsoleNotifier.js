/**
 * @constructor
 */
var ConsoleNotifier = function ConsoleNotifier() { };

/**
 * Fetches the name of the notifier.
 * @returns {string} Notifier name.
 */
ConsoleNotifier.prototype.getName = function () { return "ConsoleNotifier"; };

/**
 * Fetches the version of the notifier - 'x.x.x.x'.
 * @returns {string} Notifier version.
 */
ConsoleNotifier.prototype.getVersion = function () { return "1.0.0.0" };

/**
 * Notifies with a error.
 * @param {string} str Error string.
 * @param {function} callback On done callback.
 */
ConsoleNotifier.prototype.sendError = function sendError(str, callback) {
    // This notifier is quite basic, we just print the message to the console!
    console.error(str);
    // Then fire the callback!
    callback();
};

/**
 * Notifies with a success message.
 * @param {string} str Message string.
 * @param {number} time Time in seconds the execution of test took.
 * @param {function} callback On done callback.
 */
ConsoleNotifier.prototype.sendSuccess = function sendSuccess(str, time, callback) {
    // This notifier is quite basic, we just print the message to the console!
    console.log("Job done. Message: " + str + " - the job took: " + time + " ms to complete");
    // Then fire the callback!
    callback();
};

module.exports = new ConsoleNotifier();