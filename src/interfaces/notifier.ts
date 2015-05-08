/**
 * Notifier interface.
 * All notifier scripts have to follow this interface.
 */
interface INotifier {
  /**
   * Get the name of the notifier.
   * @returns {string} Name.
   */
  getName(): string;
  /**
   * Get the notifier version.
   * @returns {string} Version.
   */
  getVersion(): string;
  /**
   * Send error message to notifier.
   * @param {string} error Error message.
   * @param {function} done Callback to fire on done: function(void) => void.
   */
  sendError(error: string, done: () => void): void;
  /**
   * Send success message to notifier.
   * @param {string} message Message to pass to notifier.
   * @param {number} time Time the job took.
   * @param {function} done Callback to fire on done: function(void) => void.
   */
  sendSuccess(message: string, time: number, done: () => void): void;
  /**
   * Send message to notifier.
   * @param {string} message Message to send.
   * @param {function} done Callback to fire on done: function(void) => void.
   */
  sendMessage(message: string, done: () => void): void;
}

export = INotifier;