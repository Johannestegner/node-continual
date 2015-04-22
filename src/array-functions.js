if (!Array.prototype.find) {
    /**
     * Find the first instance that returns true in the predicate check.
     * @param {function} predicate - function(item) { return boolean }; Where return value is true if its the correct item else false.
     * @returns {*} Will return undefined if nothing is found, else the found object.
     */
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.asyncForEach) {
    /**
     * @param {function} callback Callback function to run on all objects in array: function(object, doneCallback);
     * @param {function} done Callback to fire when all are done.
     */
    Array.prototype.asyncForEach = function(callback, done) {
        if (this == null) {
            throw new TypeError('Array.prototype.asyncForEach called on null or undefined');
        }
        if (typeof callback !== 'function' || typeof done !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if(this.length === 0) {
            return done();
        }
        var count = this.length;
        var completed = 0;

        for(var i= 0;i<count;i++) {
            callback(this[i], function() {
                completed++;
                if(completed === count) {
                    done();
                }
            });
        }
    };
}
