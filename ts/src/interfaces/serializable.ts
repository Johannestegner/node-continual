/**
 * Serializable interface for conversion to and from json.
 */
interface ISerializable<T> {
  /**
   * Deserialize a raw json confing object and populate the 
   * serializable objects fields.
   * @param {object} data Json data.
   * @returns {object} this.
   */
  deserialize(data: any): T;
  
  // Implement serialization of objects to save config on script installation
  // This is a future feature.
  // serialize(): string;
}

export = ISerializable;