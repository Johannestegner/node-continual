#! /usr/bin/env node
process.title = 'Continual';
require('./array-functions.js');

global.log = require('node-yolog');

var util      = require('util');
var JobRunner = require('./JobRunner.js'); 

/**
 * Continual main constructor.
 */
function Continual() {

    var _self           = this;
    var _fs             = require('fs');
    var _eol            = process.platform === 'win32' ? '\r\n' : '\n';
    var _dir            = '.continual';
    var _configFile     = _dir + '/config.json';
    var _jobsFolder     = _dir + '/jobs';
    var _notifierFolder = _dir + '/notifiers';
    

    this.jobs      = [];
    this.notifiers = [];
    this.config    = {};
    
    /** 
     * Available commands.
     */
    var _commands = [
        {
            'command': '-commands'
            , 'action': 'Show this command list.'
        },
        {
            'command': '-init    ' // Spaces to format output neater.
            , 'action': 'Initialize continual in current directory.'
        }
    ];
    
    /**
     * Initialize Continual.
     * This will, if not successfull, create all continual folders required for
     * continual to run, in the current directory.
     */
    this.init = function init() {
        log.info('Initializing .continual in current directory.');
        
        if (_fs.existsSync(_dir)) {
            log.error('There is already a %s directory in this directory. Please use that one or remove it and run init command again.', _dir);
        } else {
            _fs.mkdirSync(_dir);
            if (!_fs.existsSync(_dir)) {
                log.error('Failed to create continual directory.');
            } else {
                var fileData = util.format('{%s\t"notifiers": [],%s\t"jobs": []%s}', _eol, _eol, _eol);
                _fs.writeFileSync(_configFile, fileData, 'UTF8');
                if (!_fs.existsSync(_configFile)) {
                    log.error('Failed to create config file.');
                }
                _fs.mkdir(_jobsFolder);
                _fs.mkdir(_notifierFolder);
            }
        }
    };
    
    /**
     * Print help command.
     */
    this.help = function help() {
        // Show the commands using standard output, not the yolog instance.
        console.log('Available continual commands:');
        for(command in _commands) {
            console.log('\t' + command.command + '\t' + command.action);
        }
    };
    
    /**
     * Load the config data file.
     * @returns {boolean|object} Config object on success else false.
     */
    var loadConfig = function loadConfig() {
        // Load config file.
        var config = require(process.cwd() + '/' + _configFile, 'UTF8');
        if (config.jobs.length === 0 || config.notifiers.length === 0) {
            log.error('Jobs and Notifiers can not be empty.');
            return false;
        }
        return config;
    };
    
    /**
     * Load jobs from the config file.
     * @returns {boolean} True on success else false.
     */
    var loadJobs = function loadJobs(config) {
        // Fetch the jobs to use.
        config.jobs.asyncMap(function (jobData, next) {
            var runner = new JobRunner(jobData, _dir);
            log.info('Loaded job: %s (%s) - Interval: %d', runner.getName(), runner.getVersion(), runner.getInterval());
            next(runner);
        }, function (result) {
            _self.jobs = result;
            log.debug('All (%d) jobs loaded.', _self.jobs.length);
        });
        return true;
    }
    
    /**
     * Load notifiers from the config file.
     * @returns {boolean} True on success else false.
     */
    var loadNotifiers = function loadNotifiers(config) {
        // Fetch the notifier to use.
        config.notifiers.asyncMap(function (notifierData, next) {
            var notifier = require(process.cwd() + '/' + _dir + '/' + notifierData);
            log.info("Loaded notifier: %s (%s)", notifier.getName(), notifier.getVersion());
            next(notifier);
        }, function (result) {
            _self.notifiers = result;
            log.debug('All (%d) notifiers loaded.', _self.notifiers.length);
        });
        return true;
    }

    /**
     * Load continual in current directory.
     * @returns {boolean} True on success else false.
     */ 
    this.load = function load() {
        if (!_fs.existsSync(_dir) || !_fs.existsSync(_configFile)) {
            log.error('Failed to locate continual files in directory. Have you initialized continual?');
            log.info('Type `continual -commands` for commands.');
            return false;
        }
        var config = loadConfig();    
        if (!config) {
            return false;
        }
        if (!loadNotifiers(config)) {
            return false;
        }
        if (!loadJobs(config)) {
            return false;
        }
        return true;
    };
}

var continual = new Continual();

var init = process.argv.find(function(element, index, array) {
    return element.indexOf('-init') !== -1;
});
var help = process.argv.find(function(element, index, array) {
   return element.indexOf('-commands') !== -1;
});

var debug = process.argv.find(function (element, index, array) {
    return element.indexOf('-debug') !== -1;
});

if (!debug) {
    log.set(false, 'debug', 'trace', 'todo');
}

if (help) {
    continual.help();
} else if (init) {
    continual.init();
} else {
    if (continual.load()) {
        log.info("Continual loaded and ready. Starting jobs.");
        continual.jobs.asyncForEach(function (job, d) {
            job.run();
            d();
        }, function () {
            log.info('All jobs started.');
        });
    }
}
