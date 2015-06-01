var Structures = require('./helpers/structures');
var KvP = Structures.KvP;
/**
 * CommandTypes.
 * Contains key value pairs for commands and their discriptions.
 */
var CommandTypes = (function () {
    function CommandTypes() {
    }
    CommandTypes.DEBUG = new KvP('debug', 'Debug, will display more output.');
    CommandTypes.INIT = new KvP('init', 'Initialize continual in current directory.');
    CommandTypes.HELP = new KvP('help', 'Show this command list.');
    return CommandTypes;
})();
module.exports = CommandTypes;
