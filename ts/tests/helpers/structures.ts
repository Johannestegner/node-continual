/// <reference path='../../typings/tests/tests.d.ts' />

// Libs for testing.
import Chai = require('chai');
import Structures = require('../../src/helpers/structures');

var Assert = Chai.assert;

describe('Test class KvP (Key value pair)', function() {

  it('Should have a key and a value of defined type, with defined values.', function(done) {
    var kvp = new Structures.KvP<number, string>(1, 'test');    
    Assert.equal(1, kvp.key);
    Assert.equal('test', kvp.value);
    done();
  });
});