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
 * Task interface.
 * All Job scripts needs to implement this interface.
 */
interface ITask {
  /**
   * Run the job.
   * @param {function} Callback on job done: function(error: string, message: string, time: number) => void.
   */
  runJob(done: (error: string, message: string, time: number) => void): void;  
  /**
   * Get name of the job.
   * @returns {string} Name.
   */
  getName(): string;
  /**
   * Get job Version.
   * @returns {string} Version.
   */
  getVersion(): string;
  /**
   * Get job Description.
   * @returns {string} Description.
   */
  getDescription(): string;
}
/**
 * The Task class implements the ITask and passes the calls to the script.
 */
class ContinualTask implements ITask {
  
  private subTasks: Array<ContinualTask>;
  private notifiers: Array<Notifier>;
  private interval: Interval;  
  private script: ITask;
  
  /**
   * ContinualTask constructor.
   * Creates and initializes a continual task.
   * @param {JobData} data Data to set up the task with.
   * @param {Continual} continual Continual main object.
   */
  constructor(data: Data.TaskData, continual: Continual.Continual) {
    // Set up path to the actual script file
    var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
    // Load it.
    this.script = require(path);
    // Initialize subtask and notifier arrays.
    this.subTasks = new Array<ContinualTask>();
    this.notifiers = new Array<Notifier>();
    // Create all sub-tasks (if any exists).
    for (var i = 0, count = data.subTasks.length; i < count; i++) {
      this.subTasks.push(new ContinualTask(data.subTasks[i], continual));
    }    
    // And match all notifiers that the task have defined.
    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      // Fetch notifier from the continual object.
      var notifier = continual.getNotifier(data.notifiers[i]);
      if (!notifier) {
        yolog.info('Failed to fetch a notifier (id: %d) for job with name: %s. Id did not exist in the notifier list.', data.notifiers[i], this.script.getName());
      } else {
        // If it exists, add it to the jobs notifiers.
        this.notifiers.push(notifier);
      }
    }
    // Create the interval object.
    this.interval = new Interval(data.interval);
  }
  
  /**
   * Run the job.
   * @param {function} Callback on job done: function(void) => void;
   */
  public runJob(done: () => void): void {
    // Run the main job script.
    var self = this;
    yolog.debug('Run job invoked.');
    this.script.runJob(function(error: string, message: string, time: number) {
      // The primary script is done, report to the notifiers.
      self.notifiers.asyncForEach(function(notifier: Notifier, next: () => void): void {
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
   * @param {function} Callback to fire when done (or undefined): function(void) => void;
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

// Export only the task class.
export = ContinualTask;