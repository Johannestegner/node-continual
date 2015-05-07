/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
import logger = require('node-yolog');
import Notifier = require('./notifier');
import Data = require('./config-data');
import Task = require('./task');

declare var yolog: logger.Yolog;

var _commands = {
  'init': 'Initialize continual in current directory.',
  'help': 'Show this command list.',
  'd': 'Debug, will display more output.'
};

export class ArgumentTypes {
  
  public static DEBUG: string = 'd';
  public static INIT:  string = 'init';
  public static HELP: string = 'help';

  public static length: number = 3;
  
  /**
   * Get description of a given argument/command.
   */
  static getDescription(type: string): string {
    return _commands[type];
  }  
}



export class Continual {
  
  private notifiers: Array<Notifier.ContinualNotifier>;
  private tasks: Array<Task.ContinualTask>;

  /**
   * Get a notifier by id.
   */
  getNotifier(id: number) {
    return this.notifiers.find(function(item: Notifier.ContinualNotifier, index: number, list: Object): boolean {
      return item.getId() === id;
    });
  }

  /**
   * Continual constrcutor.
   */
  constructor(configFile: string) {
    var data = Data.importConfig(configFile);
    
    yolog.info("Config loaded successfully. Setting up jobs and notifiers.");
    
    // Import all the notifiers.
    // Each notifier is a seperate module, but they all follow a given notifier interface.
    // The notifiers stored in the Continual class is not the raw ones imported from the javascript files though,
    // but rather containers.
    this.notifiers = new Array<Notifier.ContinualNotifier>();

    for (var i = 0, count = data.notifiers.length; i < count; i++) {
      this.notifiers.push(new Notifier.ContinualNotifier(data.notifiers[i]));
    }
    
    // Import all the jobs.
    // Just like with notifiers, the jobs are containers for the real job scripts.
    // Each job (or task as they are called in code), is its own object, with sub-tasks as objects too.
    this.tasks = new Array<Task.ContinualTask>();
    
    for (var i = 0, count = data.jobs.length; i < count; i++) {
      this.tasks.push(new Task.ContinualTask(data.jobs[i], this));
    }
    
    // Run all tasks (move this up to the initialization?)
    for (var i = 0, count = this.tasks.length; i < count; i++) {
      this.tasks[i].run(undefined);
    }
    
  }
  
}
