/// <reference path='../../typings/tests/tests.d.ts' />
/// <reference path='../../src/helpers/arrayextend.ts' />
require('../../src/helpers/arrayextend');
var Chai = require('chai');
var Assert = Chai.assert;
describe('Test helper Array.', function () {
    var arr = [{ id: 1, value: 'one' }, { id: 2, value: 'two' }, { id: 4, value: 'four' }];
    describe('Test Array find.', function () {
        it('Should find by Id (4) with value "four".', function (done) {
            Assert.equal('four', arr.find(function (obj) {
                return obj.id === 4;
            }).value);
            done();
        });
    });
    describe('Test Array asyncForEach.', function () {
        it('Should iterate the list and check that values exists.', function (done) {
            arr.asyncForEach(function (obj, next) {
                Assert.isTrue(arr.indexOf(obj) !== -1);
                next();
            }, function () {
                done();
            });
        });
    });
    describe('Test Array asyncMap.', function () {
        it('Should iterate the list and produce an array with only the ids.', function (done) {
            arr.asyncMap(function (obj, next) {
                next(obj.id);
            }, function (result) {
                Assert.isArray(result);
                Assert.equal(arr.length, result.length);
                Assert.isNumber(result[0]);
                Assert.isNumber(result[1]);
                Assert.isNumber(result[2]);
                Assert.equal(1, result[0]);
                Assert.equal(2, result[1]);
                Assert.equal(4, result[2]);
                done();
            });
        });
    });
});
