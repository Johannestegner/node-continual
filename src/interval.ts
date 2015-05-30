/// <reference path="../typings/node/node.d.ts"/>
import Data = require('./config-data');

// The interval class is not much to the world.
// Its basically just a converter from a unit to ms (if even that).
// Its made as a class cause I wan't to enable different types of 
// entries. Where Interval is the most basic one.


var _units = { 'd': 24 * 60 * 60 * 1000, 'h': 60 * 60 * 1000, 'm': 60 * 1000, 's': 1000, 'ms': 1 };

/**
 * Interval.
 */
class Interval {
  
  private next: number;  
  
  /**
   * Interval constructor.
   * Creates and initializes a Interval object.
   * @param {IntervalData} data Interval data to create the Interval from.
   */
  constructor(data: Data.IntervalData) {    
    // Set up next tick value (time in ms).
    this.next = data.value * _units[data.unit];
  }
  
  /**
   * Get interval value in MS.
   * @returns {number} Interval is ms.
   */
  getNext(): number {
    return this.next;
  }
  
}

export = Interval;