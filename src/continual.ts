/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
import logger = require('node-yolog');
import Notifier = require('./notifier');
import Data = require('./config-data');
import Task = require('./task');
import Structures = require('./helpers/structures');

declare var yolog: logger.Yolog;

/**
 * CommandTypes.
 * Contains key value pairs for commands and their discriptions.
 */
export class CommandTypes {
  public static DEBUG: Structures.KvP<string, string> = new Structures.KvP<string, string>('debug', 'Debug, will display more output.');
  public static INIT: Structures.KvP<string, string> = new Structures.KvP<string, string>('init', 'Initialize continual in current directory.');
  public static HELP: Structures.KvP<string, string> = new Structures.KvP<string, string>('help', 'Show this command list.');
}

/**
 * Continual main class.
 * Contains all notifiers and tasks, initializes
 * them and starts them.
 */
export class Continual {
  
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
      this.notifiers.push(new Notifier(data.notifiers[i]));
    }
    yolog.info('Initialized %d notifiers.', this.notifiers.length);
    
    // Import all the jobs.
    // Just like with notifiers, the jobs are containers for the real job scripts.
    // Each job (or task as they are called in code), is its own object, with sub-tasks as objects too.
    this.tasks = new Array<Task>();
    
    for (var i = 0, count = data.jobs.length; i < count; i++) {
      this.tasks.push(new Task(data.jobs[i], this));
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
