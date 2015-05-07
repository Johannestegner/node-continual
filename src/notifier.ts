/// <reference path="../typings/node/node.d.ts"/>
import Data = require('./config-data');
import Util = require('util');

/**
 * The notifier interface, which all notifier scripts should follow.
 */
export interface INotifier {
  getName(): string;
  getVersion(): string;
  sendError(error: string, done: () => void): void;
  sendSuccess(message: string, time: number, done: () => void): void;
  sendMessage(message: string, done: () => void): void;
}

/**
 * The Notifier object implements the INotifier interface and passes the calls to the script.
 */
export class ContinualNotifier implements INotifier {
  
  private script: INotifier;
  private id: number;
  
  /**
   * 
   */
  constructor(data: Data.NotifierData) {
    // Set up path to the actual file
    var path = Util.format('%s/%s/%s', process.cwd(), '.continual', data.path);
    // Load it.
    this.script = require(path);
    this.id = data.id;
  }
  
    /**
   * Get the ID of the notifier.
   * The ID is app specific, and set in the settings file.
   * Later used in the Jobs to fetch the correct notifier from the continual object.
   * @returns {string} Id.
   */
  public getId(): number {
    return this.id;
  }
  
  /**
   * Get the name of the notifier.
   * @returns {string} Name.
   */
  public getName(): string {
    return this.script.getName();
  }
  
  /**
   * Get the notifier version.
   * @returns {string} Version.
   */
  public getVersion(): string {
    return this.script.getVersion();
  }
  
  /**
   * Send error message to notifier.
   * @param {string} error Error message.
   * @param {function} done Callback to fire on done.
   */
  public sendError(error: string, done: () => void): void {
    this.script.sendError(error, done);
  }
  
  /**
   * Send success message to notifier.
   * @param {string} message Message to pass to notifier.
   * @param {number} time Time the job took.
   * @param {function} done Callback to fire on done.
   */
  public sendSuccess(message: string, time: number, done: () => void): void {
    this.script.sendSuccess(message, time, done);
  }
  
  /**
   * Send message to notifier.
   * @param {string} message Message to send.
   * @param {function} done Callback to fire on done.
   */
  public sendMessage(message: string, done: () => void): void {
    this.script.sendMessage(message, done);
  }
}

