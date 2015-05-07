var proto = Array.prototype;
if (proto.find === undefined) {
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
