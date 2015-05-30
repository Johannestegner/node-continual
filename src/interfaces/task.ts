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

export = ITask;