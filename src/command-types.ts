import Structures = require('./helpers/structures');
import KvP = Structures.KvP;

/**
 * CommandTypes.
 * Contains key value pairs for commands and their discriptions.
 */
class CommandTypes {
  public static DEBUG: KvP<string, string> = new KvP<string, string>('debug', 'Debug, will display more output.');
  public static INIT: KvP<string, string> = new KvP<string, string>('init', 'Initialize continual in current directory.');
  public static HELP: KvP<string, string> = new KvP<string, string>('help', 'Show this command list.');
}

export = CommandTypes;