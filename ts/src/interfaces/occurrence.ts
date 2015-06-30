/**
 * Occurrence interface.
 */
interface IOccurrence {
  /**
   * Get next tick.
   * @return {number} Time til next tick in ms.
   */
  getNext: () => number;
  /**
   * If the occurrence is only supposed to run once.
   * @return {boolean} True if its one time only, else false.
   */
  isOnce: () => boolean;
}

export = IOccurrence;