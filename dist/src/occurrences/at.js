var OccurrenceAt = (function () {
    function OccurrenceAt(data) {
        this.at = data.at;
        this.once = data.once;
        this.done = false;
    }
    OccurrenceAt.prototype.getVal = function (val, curDate) {
        // The value is a hh:mm:ss where each could be * (each occurrence)s.
        // So replace each occurrence with curDate value.
        var split = val.split(':');
        var h = split[0] === '*' ? curDate.getHours() : parseInt(split[0]);
        var m = split[1] === '*' ? curDate.getMinutes() : parseInt(split[1]);
        var s = split[2] === '*' ? curDate.getSeconds() : parseInt(split[2]);
        var next = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), h, m, s, 0);
        if (next.getTime() < Date.now()) {
            if (split[2] === '*') {
                next.setTime(next.getTime() + (1 * 1000));
            }
            else if (split[1] === '*') {
                next.setTime(next.getTime() + (1 * 1000 * 60));
            }
            else if (split[0] === '*') {
                next.setTime(next.getTime() + (1 * 1000 * 60 * 60));
            }
            else {
                next.setTime(next.getTime() + (1 * 1000 * 60 * 60 * 24));
            }
            return this.getVal(val, next);
        }
        return next.getTime();
    };
    OccurrenceAt.prototype.getNext = function () {
        if (this.done) {
            return -1;
        }
        else if (this.isOnce()) {
            this.done = true;
        }
        var _now = new Date();
        var _self = this;
        var values = this.at.map(function (value, index, list) {
            return _self.getVal(value, _now);
        });
        values = values.sort(function (a, b) {
            return a - b;
        });
        var value = values[0];
        return value - (new Date()).getTime();
    };
    OccurrenceAt.prototype.isOnce = function () {
        return this.once;
    };
    return OccurrenceAt;
})();
module.exports = OccurrenceAt;
