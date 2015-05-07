/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
/// <reference path="helpers/arrayextend.ts"/>
/// <reference path="continual"/>
require('./helpers/arrayextend');
var logger = require('node-yolog');
global.yolog = logger;
var fs = require('fs');
var _dir = '.continual';
var _configFile = _dir + '/config.json';
var Continual = require('./continual');
var getArg = function getArg(command) {
    return process.argv.find(function (element, index, array) {
        return element.indexOf('-' + command) !== -1;
    });
};
var ArgumentTypes = Continual.ArgumentTypes;
if (getArg(ArgumentTypes.DEBUG) === undefined) {
    yolog.set(false, 'debug', 'trace', 'todo');
}
yolog.debug('Debug mode is on.');
if (getArg(ArgumentTypes.INIT) !== undefined) {
    var _jobsFolder = _dir + '/jobs';
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
else if (getArg(ArgumentTypes.HELP) !== undefined) {
    console.log('\nAvailable continual commands & options:\n');
    console.log('-%s\t%s', ArgumentTypes.INIT, ArgumentTypes.getDescription(ArgumentTypes.INIT));
    console.log('-%s\t%s', ArgumentTypes.HELP, ArgumentTypes.getDescription(ArgumentTypes.HELP));
    console.log('-%s\t%s\n', ArgumentTypes.DEBUG, ArgumentTypes.getDescription(ArgumentTypes.DEBUG));
}
else {
    var continual = new Continual.Continual(_configFile);
}
