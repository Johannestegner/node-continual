/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
/// <reference path="helpers/arrayextend.ts"/>
require('./helpers/arrayextend');
var fs = require('fs');
var yolog = require('node-yolog');
var Continual = require('./continual');
var CommandTypes = require('./command-types');
var _dir = '.continual';
var _configFile = _dir + '/config.json';
var hasArg = function getArg(command) {
    var out = process.argv.find(function (element, index, array) {
        return element.toLowerCase().indexOf('-' + command.key.toLowerCase()) !== -1;
    });
    return out !== undefined;
};
if (!hasArg(CommandTypes.DEBUG)) {
    yolog.set(false, 'debug', 'trace', 'todo');
}
yolog.debug('Debug mode is on.');
if (hasArg(CommandTypes.INIT)) {
    var _tasksFolder = _dir + '/tasks';
    var _notifierFolder = _dir + '/notifiers';
    yolog.info('Initializing continual in current directory.');
    fs.exists(_dir, function (exists) {
        if (exists) {
            yolog.error('There is a %s directory in this directory. Please use that one or remove it and run init command again.', _dir);
        }
        else {
            fs.mkdir(_dir, function (error) {
                if (error !== null) {
                    yolog.error('Failed to create %s directory.', _dir);
                }
                else {
                    var continual = {
                        "notifiers": [],
                        "tasks": []
                    };
                    fs.writeFile(_configFile, JSON.stringify(continual, null, '  '), 'UTF8', function (error) {
                        if (error !== null) {
                            yolog.error('Failed to create the config file.');
                        }
                    });
                    fs.mkdir(_tasksFolder);
                    fs.mkdir(_notifierFolder);
                }
            });
        }
    });
}
else if (hasArg(CommandTypes.HELP)) {
    console.log('\nAvailable continual commands & options:\n');
    console.log('-%s\t%s', CommandTypes.INIT.key, CommandTypes.INIT.value);
    console.log('-%s\t%s', CommandTypes.HELP.key, CommandTypes.HELP.value);
    console.log('-%s\t%s\n', CommandTypes.DEBUG.key, CommandTypes.DEBUG.value);
}
else {
    var continual = new Continual(_configFile);
    continual.start();
}
