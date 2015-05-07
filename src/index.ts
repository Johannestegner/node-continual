/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/node-yolog.d.ts"/>
/// <reference path="helpers/arrayextend.ts"/>
/// <reference path="continual"/>

require('./helpers/arrayextend');
// Set up the global logger object.
import logger = require('node-yolog');
declare var yolog: logger.Yolog;
global.yolog = logger;
import fs = require('fs');

// Continual default directory and config file.
var _dir            = '.continual';
var _configFile     = _dir + '/config.json';

// Import the Continual namespace.
import Continual = require('./continual');

/**
 * Fetch an argument from the argv list.
 * @returns {undefined|string} The argument, if found, or undefined.
 */
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
  var _jobsFolder     = _dir + '/jobs';
  var _notifierFolder = _dir + '/notifiers';
  yolog.info('Initializing continual in current directory.');
  // Initialize Continual directory in current dir.
  fs.exists(_dir, function(exists: boolean) {
    if (exists) {
      yolog.error('There is a %s directory in this directory. Please use that one or remove it and run init command again.', _dir);
    } else {
      fs.mkdir(_dir, function(error: NodeJS.ErrnoException) {
        if (error !== null) {
          yolog.error('Failed to create %s directory.', _dir);
        } else {
          // Create the continual json file.
          var continual = {
            "notifiers": [],
            "jobs": []
          };
          fs.writeFile(_configFile, JSON.stringify(continual, null, '  '), 'UTF8', function(error: NodeJS.ErrnoException) {
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
  
} else if (getArg(ArgumentTypes.HELP) !== undefined) {  
  // Show the commands using standard output, not the yolog instance.
  console.log('\nAvailable continual commands & options:\n');
  console.log('-%s\t%s', ArgumentTypes.INIT, ArgumentTypes.getDescription(ArgumentTypes.INIT));
  console.log('-%s\t%s', ArgumentTypes.HELP, ArgumentTypes.getDescription(ArgumentTypes.HELP));
  console.log('-%s\t%s\n', ArgumentTypes.DEBUG, ArgumentTypes.getDescription(ArgumentTypes.DEBUG));
} else {
  // Create a new Continual object and start.
  var continual = new Continual.Continual(_configFile);
}