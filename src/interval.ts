/// <reference path="../typings/node/node.d.ts"/>
import Data = require('./config-data');

var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };

/**
 * Interval object.
 */
export class Interval {
  
  private next: number;  
  
  /**
   * 
   */
  constructor(data: Data.IntervalData) {    
    // Set up next tick value (time in ms).
    this.next = data.value * _units[data.unit];
  }
  
  /**
   * Get interval value in MS.
   */
  getNext(): number {
    return this.next;
  }
}