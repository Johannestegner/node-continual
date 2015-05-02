/**
 * Timed entry.
 * A object which calculates the next time til next run of a job.
 * 
 * Passed object should look like:
 * <pre>
 * {
 *   value: number,
 *   unit: 'ms'|'s'|'m'|'h'|'d'
 * }
 * </pre>
 * Example:
 * <pre>
 * {
 *   value: 5,
 *   unit: 'm'
 * }
 * // Will tick every 5 minutes.
 * <pre>
 * @param {object} data Interval data.
 */
function TimedEntry(data) {
    var _interval;
    var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };
    
    if (_units.indexOf(data.unit) === -1) {
        throw new error('Failed to calculate time, unit is not valid: ' + data.unit);
    }

    // Get the actual time in ms.
    _interval = data.value * _units[data.unit];
    
    /**
     * Get next interval in ms.
     */
    this.getNext = function getNext() {
        // The getNext function is not really very usefull yet, cause it will only return the interval as of now.
        // But the plan is to make it possible to create other type of Entries, so this function is here to keep the
        // API intact even when that is done!
        return _interval;
    };
}

module.exports = TimedEntry;
