/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
import yolog = require('node-yolog');
import Notifier = require('./notifier');
import Data = require('./config-data');
import Task = require('./task');

/**
 * Continual main class.
 * Contains all notifiers and tasks, initializes
 * them and starts them.
 */
class Continual {
  
  private notifiers: Array<Notifier>;
  private tasks: Array<Task>;

  /**
   * Get a notifier by id.
   * @param {number} id Id of the notifier.
   * @returns {ContinualNotifier|undefined} The Notifier.
   */
  getNotifier(id: number) {
    return this.notifiers.find(function(item: Notifier, index: number, list: Object): boolean {
      return item.getId() === id;
    });
  }

  /**
   * Continual constrcutor.
   * Creates and initializes a Continual object.
   * @param {string} configFile The configuration file path.
   */
  constructor(configFile: string) {
    var data = Data.importConfig(configFile);
    
    yolog.info("Config loaded successfully. Setting up jobs and notifiers.");
    
    // Import all the notifiers.
    // Each notifier is a seperate module, but they all follow a given notifier interface.
    // The notifiers stored in the Continual class is not the raw ones imported from the javascript files though,
    // but rather containers.
    this.notifiers = new Array<Notifier>();

    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      var notifier = new Notifier(data.notifiers[i]);
      this.notifiers.push(notifier);
      yolog.info('Loaded Notifier "%s" - v%s', notifier.getName(), notifier.getVersion());
    }
    yolog.info('Initialized %d notifiers.', this.notifiers.length);
    
    // Import all the jobs.
    // Just like with notifiers, the jobs are containers for the real job scripts.
    // Each job (or task as they are called in code), is its own object, with sub-tasks as objects too.
    this.tasks = new Array<Task>();
    
    for (var i = 0, count = data.jobs.length; i < count; i++) {
      var task = new Task(data.jobs[i], this);
      this.tasks.push(task);
      yolog.info('Loaded Task "%s" - v%s. (total of %d sub-tasks).', task.getName(), task.getVersion(), task.getSubtaskCount());
    }
    yolog.info('Intialized %d Jobs/Tasks.', this.tasks.length);
  }
  
  /**
   * Start all tasks.
   */
  public start() {
    for (var i = 0, count = this.tasks.length; i < count; i++) {
      this.tasks[i].run(undefined);
    }
    yolog.info('All tasks started.');
  }
  
}

export = Continual;