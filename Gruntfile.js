const { initGlobals } = require('./build/config/init');

module.exports = function (grunt) {
    initGlobals(grunt);

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: {
            pattern: 'grunt-*',
            scope  : 'devDependencies',
            config : require('./package.json'),
        },
    });
};
