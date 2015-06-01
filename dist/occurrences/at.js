var OccurrenceAt = (function () {
    function OccurrenceAt(data) {
        // Set up next tick value (time in ms).
        this.once = data.once;
    }
    OccurrenceAt.prototype.getVal = function (val, curDate) {
        // The value is a hh:mm:ss where each could be * (each occurrence) (except seconds).
        // So replace each occurrence with curDate value.
        var split = val.split(':');
        var h = split[0] === '*' ? curDate.getHours() : parseInt(split[0]);
        var m = split[1] === '*' ? curDate.getMinutes() : parseInt(split[1]);
        var s = split[2] === '*' ? curDate.getSeconds() : parseInt(split[2]);
        return (new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), h, m, s, 0).getTime());
    };
    /**
    * Get next tick.
    * @return {number} Time til next tick in ms.
    */
    OccurrenceAt.prototype.getNext = function () {
        var _now = new Date();
        var _self = this;
        // Convert values to timestamps and sort.
        var values = this.at.map(function (value, index, list) {
            return _self.getVal(value, _now);
        });
        values = values.sort(function (a, b) {
            return a - b;
        });
        var value = values[0];
        return (new Date()).getTime() - value;
    };
    /**
    * If the interval is to be run once or continualy.
    * @return {boolean}
    */
    OccurrenceAt.prototype.isOnce = function () {
        return this.once;
    };
    return OccurrenceAt;
})();
module.exports = OccurrenceAt;
