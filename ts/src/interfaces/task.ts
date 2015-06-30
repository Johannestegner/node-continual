/**
 * Task interface.
 * All task scripts needs to implement this interface.
 */
interface ITask {
  /**
   * Run the task.
   * @param {function} Callback on task done: function(error: string, message: string, time: number) => void.
   */
  runTask(done: (error: string, message: string, time: number) => void): void;  
  /**
   * Get name of the task.
   * @returns {string} Name.
   */
  getName(): string;
  /**
   * Get task Version.
   * @returns {string} Version.
   */
  getVersion(): string;
  /**
   * Get task Description.
   * @returns {string} Description.
   */
  getDescription(): string;
}

export = ITask;