/// <reference path="../../typings/node/node.d.ts"/>
import IOccurrence = require('../interfaces/occurrence');
import Data = require('../config-data');

class OccurrenceAt implements IOccurrence {

  private once: boolean;
  private at: Array<string>;

  constructor(data: Data.IntervalData) {
    // Set up next tick value (time in ms).

    this.once = data.once;
  }

  private getVal(val: string, curDate: Date): number {
    // The value is a hh:mm:ss where each could be * (each occurrence) (except seconds).
    // So replace each occurrence with curDate value.

    var split: string[] = val.split(':');
    var h: number = split[0] === '*' ? curDate.getHours() : parseInt(split[0]);
    var m: number = split[1] === '*' ? curDate.getMinutes() : parseInt(split[1]);
    var s: number = split[2] === '*' ? curDate.getSeconds() : parseInt(split[2]);

    return (new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), h, m, s, 0).getTime());
  }

  /**
  * Get next tick.
  * @return {number} Time til next tick in ms.
  */
  public getNext(): number {
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

    return (new Date()).getTime() - value;
  }

  /**
  * If the interval is to be run once or continualy.
  * @return {boolean}
  */
  public isOnce(): boolean {
    return this.once;
  }
}

export = OccurrenceAt;