/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
/// <reference path="helpers/arrayextend.ts"/>
require('./helpers/arrayextend');
var fs = require('fs');
var yolog = require('node-yolog');
var Continual = require('./continual');
var CommandTypes = require('./command-types');
// Continual default directory and config file.
var _dir = '.continual';
var _configFile = _dir + '/config.json';
/**
 * Fetch an argument from the argv list.
 * @param {object} Command KvP object.
 * @returns {boolean} If arg is supplied, true, else false.
 */
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
    var _jobsFolder = _dir + '/jobs';
    var _notifierFolder = _dir + '/notifiers';
    yolog.info('Initializing continual in current directory.');
    // Initialize Continual directory in current dir.
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
                    // Create the continual json file.
                    var continual = {
                        "notifiers": [],
                        "jobs": []
                    };
                    fs.writeFile(_configFile, JSON.stringify(continual, null, '  '), 'UTF8', function (error) {
                        if (error !== null) {
                            yolog.error('Failed to create the config file.');
                        }
                    });
                    fs.mkdir(_jobsFolder);
                    fs.mkdir(_notifierFolder);
                }
            });
        }
    });
}
else if (hasArg(CommandTypes.HELP)) {
    // Show the commands using standard output, not the yolog instance.
    console.log('\nAvailable continual commands & options:\n');
    console.log('-%s\t%s', CommandTypes.INIT.key, CommandTypes.INIT.value);
    console.log('-%s\t%s', CommandTypes.HELP.key, CommandTypes.HELP.value);
    console.log('-%s\t%s\n', CommandTypes.DEBUG.key, CommandTypes.DEBUG.value);
}
else {
    // Create a new Continual object and start.
    var continual = new Continual(_configFile);
    continual.start();
}
