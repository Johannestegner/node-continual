// This file contains extensions/polyfills for the Array class.
// The array class lacks (in ES5) the array.find function, hence its
// created here if its not already found.
// I have also created a asyncForEach function and a asyncMap function for 
// easy access and to not have to include any external dependencies for this.
var proto = Array.prototype;
if (proto.find === undefined) {
    /**
     * Find the first instance that returns true in the predicate check.
     * @param {function} predicate - function(item) { return boolean }; Where return value is true if its the correct item else false.
     * @returns {*} Will return undefined if nothing is found, else the found object.
     */
    proto.find = function find(predicate) {
        var list = Object(this);
        var len = list.length >>> 0;
        var thisArg = arguments[1];
        var val;
        for (var i = 0; i < len; i++) {
            val = list[i];
            if (predicate.call(thisArg, val, i, list)) {
                return val;
            }
        }
        return undefined;
    };
}
if (proto.asyncForEach === undefined) {
    /**
     * @param {function} callback Callback function to run on all objects in array: function(object, doneCallback);
     * @param {function} done Callback to fire when all are done.
     */
    proto.asyncForEach = function asyncForEach(callback, done) {
        var list = Object(this);
        var len = list.length >>> 0;
        var completed = 0;
        if (len === 0) {
            return done();
        }
        for (var i = 0; i < len; i++) {
            callback(list[i], function () {
                completed++;
                if (completed === len) {
                    return done();
                }
            });
        }
    };
}
if (proto.asyncMap === undefined) {
    /**
     * @param {function} callback Callback to run on each object: function(object, callback) - where callback should pass the result object as arg.
     * @param {function} done Callback to fire on done: function(list) - Where list is an array of the resulting objects.
     */
    proto.asyncMap = function (callback, done) {
        var result = new Array();
        this.asyncForEach(function (object, next) {
            result.push(object);
            next();
        }, function () {
            done(result);
        });
    };
}
