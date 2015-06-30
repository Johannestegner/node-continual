var Structures = require('./helpers/structures');
var KvP = Structures.KvP;
var CommandTypes = (function () {
    function CommandTypes() {
    }
    CommandTypes.DEBUG = new KvP('debug', 'Debug, will display more output.');
    CommandTypes.INIT = new KvP('init', 'Initialize continual in current directory.');
    CommandTypes.HELP = new KvP('help', 'Show this command list.');
    return CommandTypes;
})();
module.exports = CommandTypes;
