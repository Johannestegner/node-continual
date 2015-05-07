import fs = require('fs');

/**
 * Serializable interface for conversion to and from json.
 */
interface Serializable<T> {
  deserialize(input: Object): T;
}

/**
 * Config interval as Data.
 */
export class IntervalData implements Serializable<IntervalData> {
  unit: string;
  value: number;  

  deserialize(data: any) {
    this.unit = data.unit;
    this.value = data.value;

    return this;
  }
}

/**
 * Config notifier as Data.
 */
export class NotifierData implements Serializable<NotifierData> {
  id: number;
  path: string;
  
  deserialize(data: any) {
    this.id = data.id;
    this.path = data.path;

    return this;
  }
}

/**
 * Config job as Data.
 */
export class JobData implements Serializable<JobData> {
  notifiers: Array<number>;
  path: string;
  interval: IntervalData;
  subTasks: Array<JobData>;
  
  constructor() {
    this.subTasks = new Array<JobData>();
    this.notifiers = new Array<number>();
  }
  
  deserialize(data: any) {
    this.notifiers = data.notifiers;
    this.path = data.path;
    this.interval = new IntervalData().deserialize(data.interval);
    
    if (data.then !== undefined) {
      for (var i = 0, count = data.then.length; i < count; i++) {
        this.subTasks.push(new JobData().deserialize(data.then[i]));
      }
    }

    return this;
  }
}

/**
 * Config file as Data.
 */
export class ConfigData implements Serializable<ConfigData> {
  
  constructor() {
    this.notifiers = new Array<NotifierData>();
    this.jobs = new Array<JobData>();
  }
  
  deserialize(data: any) {
    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      this.notifiers.push(new NotifierData().deserialize(data.notifiers[i]));
    }

    for (var i = 0, count = data.jobs.length; i < count; i++) {
      this.jobs.push(new JobData().deserialize(data.jobs[i]));
    }
    
    return this;
  }

  notifiers: Array<NotifierData>;
  jobs: Array<JobData>;
  
}

/**
 * Import config.
 */
export function importConfig(filePath: string) {
  var data = fs.readFileSync(filePath, 'UTF8');
  return new ConfigData().deserialize(JSON.parse(data));
}