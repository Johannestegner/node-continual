
interface Array<T> {
  find(predicate: (item: T, index: number, list: Object) => boolean): T;
  asyncForEach(callback: (obj: T, next: () => void) => void, done: () => void): void;
  asyncMap(callback: (obj: T, next: (obj: any) => void) => void, done: (result: Array<any>) => void): void;
}

var proto: any = Array.prototype;
  
if (proto.find === undefined) {
  /**
   * Find the first instance that returns true in the predicate check.
   * @param {function} predicate - function(item) { return boolean }; Where return value is true if its the correct item else false.
   * @returns {*} Will return undefined if nothing is found, else the found object.
   */
  proto.find = function find(predicate: (item: any, index: number, list: Object) => boolean): any {
    var list = Object(this);
    var len = list.length >>> 0;
    var thisArg = arguments[1];
    var val;
  
    for (var i = 0; i < len; i++) {
      val = list[i];
      if (predicate.call(thisArg, val, i, list)) {
        return val;
      }
    }
    return undefined;
  };
}

if (proto.asyncForEach === undefined) {
  /**
   * @param {function} callback Callback function to run on all objects in array: function(object, doneCallback);
   * @param {function} done Callback to fire when all are done.
   */
  proto.asyncForEach = function asyncForEach(callback: (obj: any, next: () => void) => void, done: () => void): void {
    var list = Object(this);
    var len = list.length >>> 0;
    var completed = 0;
    if (len === 0) {
      return done();
    }

    for (var i = 0; i < len; i++) {
      callback(list[i], function() {
        completed++;
        if (completed === len) {
          return done();
        }
      });
    }
  };
}

if (proto.asyncMap === undefined) {
  /**
   * @param {function} callback Callback to run on each object: function(object, callback) - where callback should pass the result object as arg.
   * @param {function} done Callback to fire on done: function(list) - Where list is an array of the resulting objects.
   */
  proto.asyncMap = function(callback: (obj: any, next: (obj: any) => void) => void, done: (result: any[]) => void): void {
    var result = new Array();

    this.asyncForEach(function(object: any, next: () => void) {
      result.push(object);
      next();
    }, function(): void {
        done(result);
      });
  };
}
