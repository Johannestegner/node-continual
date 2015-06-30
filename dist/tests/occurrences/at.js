/// <reference path='../../typings/tests/tests.d.ts' />
var Chai = require('chai');
var Sinon = require('sinon');
var Data = require('../../src/config-data');
var OccurrenceAt = require('../../src/occurrences/at');
var Assert = Chai.assert;
var clock = null;
describe('Test class OccurrenceAt', function () {
    beforeEach(function () {
        var timestamp = (new Date(2000, 1, 1, 1, 1, 1, 0)).getTime();
        clock = Sinon.useFakeTimers(timestamp);
    });
    afterEach(function () {
        clock.restore();
    });
    describe('Test isOnce()', function () {
        var occurrence = null;
        beforeEach(function () {
            occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
                'at': [
                    '*:*:10'
                ],
                'once': true
            }));
        });
        it('isOnce() Should return true.', function (done) {
            Assert.isTrue(occurrence.isOnce());
            done();
        });
        it('isOnce() Should return false.', function (done) {
            var o = new OccurrenceAt((new Data.IntervalData()).deserialize({
                'at': [
                    '*:*:10'
                ],
                'once': false
            }));
            Assert.isFalse(o.isOnce());
            done();
        });
    });
    describe('Test getNext()', function () {
        var date = null;
        var occurrence = null;
        beforeEach(function () {
            date = new Date();
            var value = '*:*:' + (date.getSeconds() + 2);
            var res = date.getTime() - new Date().getTime();
            occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
                'at': [
                    value
                ],
                'once': false
            }));
        });
        it('Next tick should be in 2 seconds.', function (done) {
            Assert.equal(2000, occurrence.getNext());
            done();
        });
        it('Change time (3 s), next tick should be in 59 seconds.', function (done) {
            clock.tick(3 * 1000);
            Assert.equal(59000, occurrence.getNext());
            done();
        });
        it('Should return next tick.', function (done) {
            occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
                'at': [
                    '*:*:10'
                ],
                'once': true
            }));
            Assert.equal(9000, occurrence.getNext());
            done();
        });
        it('Should first return next tick, then -1.', function (done) {
            occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
                'at': [
                    '*:*:10'
                ],
                'once': true
            }));
            Assert.equal(9000, occurrence.getNext());
            Assert.equal(-1, occurrence.getNext());
            done();
        });
    });
});
