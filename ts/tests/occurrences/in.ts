/// <reference path='../../typings/tests/tests.d.ts' />

// Libs for testing.
import Chai = require('chai');
import Sinon = require('sinon');

import Data = require('../../src/config-data');
import OccurrenceIn = require('../../src/occurrences/in');

var Assert = Chai.assert;
var clock: Sinon.SinonFakeTimers = null;

describe('Test class OccurrenceIn', function () {

  beforeEach(function() {
    // Set up faked date and timers using sinon.
    var timestamp = (new Date(2000, 1, 1, 1,1, 1, 0)).getTime();
    clock = Sinon.useFakeTimers(timestamp);
  });

  afterEach(function () {
    clock.restore();
  });

  describe('Test isOnce()', function() {

    var occurrence: OccurrenceIn = null;
    
    beforeEach(function() {
      occurrence = new OccurrenceIn((new Data.IntervalData()).deserialize({
        'value': 1,
        'unit': 's',
        'once': true
      }));
    });
    
    it('isOnce() Should return true.', (done) => {
      Assert.isTrue(occurrence.isOnce());
      done();
    });
    
    
    it('isOnce() Should return false.', (done) => {
      var o = new OccurrenceIn((new Data.IntervalData()).deserialize({
        'value': 1,
        'unit': 's',
        'once': false
      }));
      Assert.isFalse(o.isOnce());
      done();
    });
    
  });

  describe('Test getNext()', function() {
    
    var occurrence: OccurrenceIn = null;
    
    beforeEach(function() {
      occurrence = new OccurrenceIn((new Data.IntervalData()).deserialize({
        'value': 1,
        'unit': 's',
        'once': true
      }));
    });
 
    it('Next tick should be in 1 second.', (done) => {
      Assert.equal(1000, occurrence.getNext());
      done();
    });
    
    it('Next tick should be in 1 seconds, then return -1.', (done) => {
      Assert.equal(1000, occurrence.getNext());
      Assert.equal(-1, occurrence.getNext());
      done();
    });
    
  });

});



