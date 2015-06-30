var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };
var OccurrenceIn = (function () {
    function OccurrenceIn(data) {
        this.next = data.in * _units[data.unit];
        this.once = data.once;
        this.done = false;
    }
    OccurrenceIn.prototype.getNext = function () {
        if (this.done) {
            return -1;
        }
        else if (this.isOnce()) {
            this.done = true;
        }
        return this.next;
    };
    OccurrenceIn.prototype.isOnce = function () {
        return this.once;
    };
    return OccurrenceIn;
})();
module.exports = OccurrenceIn;
