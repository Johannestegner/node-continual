
var NotifierInterface = function NotifierInterface() {

};

NotifierInterface.prototype.name = function() {}
NotifierInterface.prototype.sendError = function sendError(str, callback) {};
NotifierInterface.prototype.sendSuccess = function sendSuccess(str, time, callback) {}
