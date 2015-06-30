import fs = require('fs');
import ISerializable = require('./interfaces/serializable');

export enum EIntervalType {
  In,
  At
}

/**
 * IntervalData.
 * Data object containing information about a interval.
 */
export class IntervalData implements ISerializable<IntervalData> {
  
  unit: string;
  in: number;
  at: Array<string>;
  once: boolean;
  type: EIntervalType;
  
  /**
   * IntervalData constructor.
   * Creates a IntervalData object.
   * A IntervalData object should be deserailized before usage, so that
   * its fields are populated.
   * This should be handeled internally by the TaskData object.
   * @see TaskData
   * @see deserialize
   * @see Serializable<T>
   */
  constructor() {
    // Nothing is currently done in the IntervalData constructor.
  }

  /**
   * Deserialize a raw json config object (part containing interval data)
   * and populate the IntervalData fields.
   * @param {object} data Json data.
   * @returns {IntervalData} this.
   */
  deserialize(data: any) {

    if ('at' in data) {
      this.type = EIntervalType.At;
      this.at = data.at;
    } else if ('in' in data) {
      this.type = EIntervalType.In;
      this.in = data.in.value;
      this.unit = data.in.unit;
    } else {
      throw new Error('Occurrence was neither of the type At or In.');
    }

    this.once = data.once;
    return this;
  }
}

/**
 * NotifierData.
 * Data object containing information about a notifier.
 */
export class NotifierData implements ISerializable<NotifierData> {
  
  id: number;
  path: string;
  
  /**
   * NotifierData constructor.
   * Creates a NotifierData object.
   * A NotifierData object should be deserialized before usage, so that
   * its fields are populated.
   * This should be handeled internally by the ConfigData object.
   * @see ConfigData
   * @see deserialize
   * @see Serializable<T>
   */
  constructor() {
    // Nothing is currently done int the NotiferData constructor.
  }
  
  /**
   * Deserialize a raw json config object (part containing notifier data)
   * and populate the NotifierData fields.
   * @param {object} data Json data.
   * @returns {NotifierData} this.
   */
  deserialize(data: any) {
    this.id = data.id;
    this.path = data.path;

    return this;
  }
}

/**
 * TaskData.
 * Data object containing information about a task and its sub-tasks.
 */
export class TaskData implements ISerializable<TaskData> {
  
  notifiers: Array<number>;
  path: string;
  interval: IntervalData;
  subTasks: Array<TaskData>;
  
  /**
   * TaskData constructor.
   * Creates a TaskData object.
   * A TaskData object should be deserialized before usage, so that
   * its fields are populated.
   * This should be handeled internally by the ConfigData object.
   * @see ConfigData
   * @see deserialize
   * @see Serializable<T>
   */
  constructor() {
    this.subTasks = new Array<TaskData>();
    this.notifiers = new Array<number>();
  }
  
  /**
   * Deserialize a raw json config object (part contianing task data)
   * and populate the TaskData fields.
   * @param {object} data Json data.
   * @returns {TaskData} this.
   */
  deserialize(data: any) {
    this.notifiers = data.notifiers;
    this.path = data.path;
    this.interval = new IntervalData().deserialize(data.interval);
    // Check if any subtasks under the 'then' property.
    if (data.then !== undefined) {
      for (var i = 0, count = data.then.length; i < count; i++) {
        this.subTasks.push(new TaskData().deserialize(data.then[i]));
      }
    }
    return this;
  }
}

/**
 * ConfigData.
 * Contains all information about the configuration for the current continual instance.
 * Used mainly as a forced converter to structure so that its certain that some properties
 * exists.
 * The config data object creates all its sub-objects inside, so no need to do this manually.
 */
export class ConfigData implements ISerializable<ConfigData> {
  
  notifiers: Array<NotifierData>;
  jobs: Array<TaskData>;
  
  /**
   * ConfigData constructor.
   * Creates a config data object.
   * A configData object should be deserialized before usage, so that
   * its fields are populated.
   * @see deserialize
   * @see Serializable<T>
   */
  constructor() {
    this.notifiers = new Array<NotifierData>();
    this.jobs = new Array<TaskData>();
  }
  
  /**
   * Deserialize a raw json config object and populate the ConfigData fileds.
   * @param {object} data Json data.
   * @returns {ConfigData} this.
   */
  deserialize(data: any) {
    // Create all notifiers.
    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      this.notifiers.push(new NotifierData().deserialize(data.notifiers[i]));
    }
    // Create all tasks.
    for (var i = 0, count = data.jobs.length; i < count; i++) {
      this.jobs.push(new TaskData().deserialize(data.jobs[i]));
    }
    return this;
  }
}

/**
 * Import config.
 * @param {string} filePath Path to the configuration file.
 * @returns {ConfigData} A loaded configuration object.
 */
export function importConfig(filePath: string) {
  var data = fs.readFileSync(filePath, 'UTF8');
  return new ConfigData().deserialize(JSON.parse(data));
}