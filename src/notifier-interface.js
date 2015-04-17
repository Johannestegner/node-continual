/**
 * This file should only be used as a informational file showing the interface that is used
 * for notifiers.
 */

/**
 * @constructor
 */
var NotifierInterface = function NotifierInterface() { };

/**
 * Fetches the name of the notifier.
 * @returns {string} Notifier name.
 */
NotifierInterface.prototype.getName = function() { return ""; };

/**
 * Fetches the version of the notifier.
 * @returns {string} Notifier version.
 */
NotifierInterface.prototype.getVersion = function() { return "0" };

/**
 * Notifies with a error.
 * @param {string} str Error string.
 * @param {function} callback On done callback.
 */
NotifierInterface.prototype.sendError = function sendError(str, callback) { callback(); };

/**
 * Notifies with a success message.
 * @param {string} str Message string.
 * @param {number} time Time in seconds the execution of test took.
 * @param {function} callback On done callback.
 */
NotifierInterface.prototype.sendSuccess = function sendSuccess(str, time, callback) { callback(); };
