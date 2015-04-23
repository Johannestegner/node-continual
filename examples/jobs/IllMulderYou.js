/**
 *
 * @constructor
 */
var IllMulderYou = function IllMulderYou() { };

/**
 * Run the job.
 * @param {function} callback Callback to fire on done: function(error, message, time) - where error should be undefined if no error and message is the message passed to the notifier.
 */
IllMulderYou.prototype.runJob = function runJob(callback) {
    var start = (new Date().getTime());
    var out = 0;
    var error = undefined;
    for (var i = 1; i < 10; i++) {
        out += i * i;
    }
    if (out === null) {
        error = "Out was null!";
    }    
    callback(error, "I did good! I did numbers. And it was :" + out, (new Date().getTime()) - start);
};


IllMulderYou.prototype.getDescription = function getDescription() {
    return 'A small script that multiplies some numbers and then sends the output to the notifiers.';
};

/**
 * Fetch job name.
 * @returns {string} name
 */
IllMulderYou.prototype.getName = function getName() { return 'IllMulderYou'; };

/**
 * Fetch job version
 * @returns {string} Version as string ('x.x.x.x')
 */
IllMulderYou.prototype.getVersion = function getVersion() { return '1.0.0.0'; };

module.exports = new IllMulderYou();