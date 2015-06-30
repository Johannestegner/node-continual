/// <reference path="../../typings/node/node.d.ts"/>
import IOccurrence = require('../interfaces/occurrence');
import Data = require('../config-data');

class OccurrenceAt implements IOccurrence {

  private once: boolean;
  private done: boolean;
  private at: Array<string>;

  constructor(data: Data.IntervalData) {
    this.at = data.at;
    this.once = data.once;
    
    this.done = false;
  }

  /**
  * Parse a string value and get the next occurrence of it as a number value.
  *
  * @param {string} val Value to parse.
  * @param {Date} curDate Current date.
  * @return {number} Value in ms til next occurrence of parsed value.
  */
  private getVal(val: string, curDate: Date): number {
    // The value is a hh:mm:ss where each could be * (each occurrence)s.
    // So replace each occurrence with curDate value.

    var split: string[] = val.split(':');
    var h: number = split[0] === '*' ? curDate.getHours() : parseInt(split[0]);
    var m: number = split[1] === '*' ? curDate.getMinutes() : parseInt(split[1]);
    var s: number = split[2] === '*' ? curDate.getSeconds() : parseInt(split[2]);

    var next = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), h, m, s, 0);

    // If the time has passed, we need to increase the object with either a full day (if its a h:m:s value) or depending on which
    // value that uses the *, add a hour or minute.
    if (next.getTime() < Date.now()) {
      if (split[1] === '*') {
        // Add a minute.
        next.setTime(next.getTime() + (1 * 1000 * 60))
      } else if (split[0] === '*') {
        // Add a hour.
        next.setTime(next.getTime() + (1 * 1000 * 60 * 60));
      } else {
        // Add day.
        next.setTime(next.getTime() + (1 * 1000 * 60 * 60 * 24));
      }
      // Recurse and return the value.
      return this.getVal(val, next);
    }

    return next.getTime();
  }

  /**
  * Get next tick.
  * @return {number} Time til next tick in ms.
  */
  public getNext(): number {
    if (this.done) {
      return -1;
    } else if (this.isOnce()) {
      this.done = true;
    }
    
    var _now = new Date();
    var _self = this;
    // Convert values to timestamps and sort.
    var values: number[] = this.at.map(function (value: string, index: number, list: string[]) {
      return _self.getVal(value, _now);
    });
    values = values.sort(function (a: number, b: number) {
      return a - b;
    });
    var value: number = values[0];

    return value - _now.getTime();
  }

  /**
  * If the occurrence is to be ran once or continualy.
  * @return {boolean}
  */
  public isOnce(): boolean {
    return this.once;
  }
}

export = OccurrenceAt;
