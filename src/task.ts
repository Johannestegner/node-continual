/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
import logger = require('node-yolog');
import Data = require('./config-data');
import Notifier = require('./notifier');
import Util = require('util');
import Interval = require('./interval');
import Continual = require('./continual');

declare var yolog: logger.Yolog;

/**
 * Task interface, which all job scripts have to implement.
 */
export interface ITask {  
  runJob(done: (error: string, message: string, time: number) => void): void;
  getName(): string;
  getVersion(): string;
  getDescription(): string;
}
/**
 * The Task class implements the ITask and passes the calls to the script.
 */
export class ContinualTask implements ITask {
  
  private subTasks: Array<ContinualTask>;
  private notifiers: Array<Notifier.ContinualNotifier>;
  private interval: Interval.Interval;
  
  private script: ITask;
  
  constructor(data: Data.JobData, continual: Continual.Continual) {
    
    // Set up path to the actual file
    var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
    // Load it.
    this.script = require(path);
    
    this.subTasks = new Array<ContinualTask>();
    this.notifiers = new Array<Notifier.ContinualNotifier>();
    
    for (var i = 0, count = data.subTasks.length; i < count; i++) {
      this.subTasks.push(new ContinualTask(data.subTasks[i], continual));
    }
    
    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      // Get the 'real' notifier, if it exists.
      var notifier = continual.getNotifier(data.notifiers[i]);
      if (!notifier) {
        yolog.info('Failed to fetch a notifier for job with name: %s. Id did not exist in the notifier list.', this.script.getName());
      } else {
        this.notifiers.push(notifier);
      }
    }
    
    this.interval = new Interval.Interval(data.interval);
  }
  
  
  /**
   * Run the job.
   * @param {function} Callback on job done.
   */
  public runJob(done: () => void): void {
    // Run the main job script.
    var self = this;
    yolog.debug('Run job invoked.');
    this.script.runJob(function(error: string, message: string, time: number) {
      // The primary script is done, report to the notifiers.
      self.notifiers.asyncForEach(function(notifier: Notifier.ContinualNotifier, next: () => void): void {
        yolog.debug('Sending result to notifier named %s', notifier.getName());
        if (error) {
          notifier.sendError(error, function() { next(); });
        } else {
          notifier.sendSuccess(message, time, function() { next(); });
        }        
      }, function() {
        yolog.debug('All notifiers notifierd for the job %s', self.getName());
        yolog.debug('Calling sub-tasks.');
        self.subTasks.asyncForEach(function(task: ContinualTask, next: () => void): void {
          task.run(function() {
            next();
          });
        }, function() {
          yolog.debug('Done calling sub-tasks. Resetting timer.');
          done();
        });
      });
    });
  }
  
  /**
   * Start the job loop.
   */
  public run(callback: () => void) {
    yolog.info('Starting the task named "%s". Will run in: %d seconds.', this.getName(), (this.interval.getNext() / 1000));
    var self = this;
    
    setTimeout(function() {
      self.runJob(function() {
        if (callback) {
          callback();
        } else {
          self.run(undefined); // call itself, so that the timer restarts.
        }
      });
    }, this.interval.getNext());
  }
  
   /**
   * Get name of the job.
   * @returns {string} Name.
   */
  public getName(): string {
    return this.script.getName();
  }

  /**
   * Get job Version.
   * @returns {string} Version.
   */
  public getVersion(): string {
    return this.script.getVersion();
  }

  /**
   * Get job Description.
   * @returns {string} Description.
   */
  public getDescription(): string {
    return this.script.getDescription();
  }
}
