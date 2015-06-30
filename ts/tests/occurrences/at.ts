/// <reference path='../../typings/tests/tests.d.ts' />

// Libs for testing.
import Mocha = require('mocha');
import Chai = require('chai');
import Sinon = require('sinon');

import Data = require('../../src/config-data');
import OccurrenceAt = require('../../src/occurrences/at');


var Expect = Chai.expect;
var Assert = Chai.assert;
var sandbox: Sinon.SinonSandbox = null;
var clock: Sinon.SinonFakeTimers = null;

describe('Test class OccurrenceAt', function () {

  beforeEach(function() {
    // Set up faked date and timers using sinon.
    var timestamp = (new Date(2000, 1, 1, 1,1, 1, 0)).getTime();
    clock = Sinon.useFakeTimers(timestamp);
  });

  afterEach(function () {
    clock.restore();
  });


  describe('Test isOnce()', function() {
    
    var occurrence: OccurrenceAt = null;
    
    beforeEach(function() {
      // Set up an occurrence that is supposed to run once at *:10.
      occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
        'at': [
          '*:*:10'
        ],
        'once': true
      }));
    });
    
        
    it('isOnce() Should return true.', (done) => {
      Assert.isTrue(occurrence.isOnce());
      done();
    });

    it('isOnce() Should return false.', (done) => {
      // Try one that is supposed to be not once.
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
      
    var date: Date = null;
    var occurrence: OccurrenceAt = null;

    beforeEach(function() {
      // Create a value that is next second.
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
    

    it('Next tick should be in 2 seconds.', (done) => {
      Assert.equal(2000, occurrence.getNext());
      done();
    });
    
    it('Change time (3 s), next tick should be in 59 seconds.', (done) => {
      // Move time forward 3 seconds and test for next.
      clock.tick(3 * 1000);
      // should now be 59 seconds til next.
      Assert.equal(59000, occurrence.getNext());
      done();
    });

    it('Should return next tick.', (done) => {
      occurrence = new OccurrenceAt((new Data.IntervalData()).deserialize({
        'at': [
          '*:*:10'
        ],
        'once': true
      }));
      Assert.equal(9000, occurrence.getNext());
      done();
    });
    
    it('Should first return next tick, then -1.', (done) => {
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
