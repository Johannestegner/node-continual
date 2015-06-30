/// <reference path='../../typings/tests/tests.d.ts' />
var Chai = require('chai');
var Sinon = require('sinon');
var Data = require('../../src/config-data');
var OccurrenceIn = require('../../src/occurrences/in');
var Assert = Chai.assert;
var clock = null;
describe('Test class OccurrenceIn', function () {
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
            occurrence = new OccurrenceIn((new Data.IntervalData()).deserialize({
                'value': 1,
                'unit': 's',
                'once': true
            }));
        });
        it('isOnce() Should return true.', function (done) {
            Assert.isTrue(occurrence.isOnce());
            done();
        });
        it('isOnce() Should return false.', function (done) {
            var o = new OccurrenceIn((new Data.IntervalData()).deserialize({
                'value': 1,
                'unit': 's',
                'once': false
            }));
            Assert.isFalse(o.isOnce());
            done();
        });
    });
    describe('Test getNext()', function () {
        var occurrence = null;
        beforeEach(function () {
            occurrence = new OccurrenceIn((new Data.IntervalData()).deserialize({
                'value': 1,
                'unit': 's',
                'once': true
            }));
        });
        it('Next tick should be in 1 second.', function (done) {
            Assert.equal(1000, occurrence.getNext());
            done();
        });
        it('Next tick should be in 1 seconds, then return -1.', function (done) {
            Assert.equal(1000, occurrence.getNext());
            Assert.equal(-1, occurrence.getNext());
            done();
        });
    });
});
