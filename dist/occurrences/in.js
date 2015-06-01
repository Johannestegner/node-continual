var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };
var OccurrenceIn = (function () {
    function OccurrenceIn(data) {
        // Set up next tick value (time in ms).
        this.next = data.in * _units[data.unit];
        this.once = data.once;
    }
    /**
    * Get next tick.
    * @return {number} Time til next tick in ms.
    */
    OccurrenceIn.prototype.getNext = function () {
        return this.next;
    };
    /**
    * If the interval is to be run once or continualy.
    * @return {boolean}
    */
    OccurrenceIn.prototype.isOnce = function () {
        return this.once;
    };
    return OccurrenceIn;
})();
module.exports = OccurrenceIn;
