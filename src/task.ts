/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
import yolog = require('node-yolog');
import Data = require('./config-data');
import Notifier = require('./notifier');
import Util = require('util');
import Interval = require('./interval');
import Continual = require('./continual');
import ITask = require('./interfaces/task');
import IOccurrence = require('./interfaces/occurrence');
import OccurrenceAt = require('./occurrences/at');
import OccurrenceIn = require('./occurrences/in');



/**
 * The Task class implements the ITask and passes the calls to the script.
 */
class ContinualTask implements ITask {
  
  private subTasks: Array<ContinualTask>;
  private notifiers: Array<Notifier>;
  private occurrence: IOccurrence;  
  private script: ITask;
  private parent: ContinualTask = null;
  
  /**
   * ContinualTask constructor.
   * Creates and initializes a continual task.
   * @param {JobData} data Data to set up the task with.
   * @param {Continual} continual Continual main object.
   */
  constructor(data: Data.TaskData, continual: Continual) {
    // Set up path to the actual script file
    var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
    // Load it.
    this.script = require(path);
    // Initialize subtask and notifier arrays.
    this.subTasks = new Array<ContinualTask>();
    this.notifiers = new Array<Notifier>();
    // Create all sub-tasks (if any exists).
    for (var i = 0, count = data.subTasks.length; i < count; i++) {
      var subtask: ContinualTask = new ContinualTask(data.subTasks[i], continual);
      subtask.parent = this;
      this.subTasks.push(subtask);
    }    
    // And match all notifiers that the task have defined.
    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      // Fetch notifier from the continual object.
      var notifier = continual.getNotifier(data.notifiers[i]);
      if (!notifier) {
        yolog.info('Failed to fetch a notifier (id: %d) for task with name: %s. Id did not exist in the notifier list.', data.notifiers[i], this.script.getName());
      } else {
        // If it exists, add it to the jobs notifiers.
        this.notifiers.push(notifier);
      }
    }

    // Create the occurrence object.
    if (data.interval.type === Data.EIntervalType.At) {
      this.occurrence = new OccurrenceAt(data.interval);
    } else if (data.interval.type === Data.EIntervalType.In) {
      this.occurrence = new OccurrenceIn(data.interval);
    }
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
          if (!self.parent) {
            yolog.info('The task %s and potential subtasks are done running.', self.getName());
            yolog.debug('Done calling sub-tasks. Resetting timer.');
          }
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
    var next = this.occurrence.getNext();
    yolog.info(
      'Running the task "%s"%s in %d seconds.',
      this.getName(),
      (this.parent !== null ? ' (Sub-task of "' + this.parent.getName() + '")' : ''),
      (next / 1000)
    );
    var self = this;
    
    setTimeout(function() {
      self.runJob(function() {
        if (callback) {
          callback();
        } else {
          if (!self.occurrence.isOnce) {
            // call itself, so that the timer restarts
            self.run(undefined);
          }
        }
      });
    }, next);
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
  
  /**
   * Get the Tasks sub-task count (including sub-tasks tasks).
   * @returns {number} Total count of tasks under the given task.
   */
  public getSubtaskCount() {
    var total = this.subTasks.length;
    for (var i = 0, count=this.subTasks.length; i < count; i++) {
      total += this.subTasks[i].getSubtaskCount();
    }
    return total;
  }
}

// Export only the task class.
export = ContinualTask;