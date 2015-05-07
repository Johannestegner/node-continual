var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };
var Interval = (function () {
    function Interval(data) {
        this.next = data.value * _units[data.unit];
    }
    Interval.prototype.getNext = function () {
        return this.next;
    };
    return Interval;
})();
exports.Interval = Interval;
