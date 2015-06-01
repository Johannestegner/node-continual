/// <reference path="../../typings/node/node.d.ts"/>
import IOccurrence = require('../interfaces/occurrence');
import Data = require('../config-data');

var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };

class OccurrenceIn implements IOccurrence {
  
  private next: number;
  private once: boolean;
  
  constructor(data: Data.IntervalData) {
    // Set up next tick value (time in ms).
    this.next = data.in * _units[data.unit];
    this.once = data.once;
  }
  
  /**
  * Get next tick.
  * @return {number} Time til next tick in ms.
  */
  public getNext(): number {
    return this.next;
  }
  
  /**
  * If the interval is to be run once or continualy.
  * @return {boolean}
  */ 
  public isOnce(): boolean {
    return this.once;
  }
}

export = OccurrenceIn;