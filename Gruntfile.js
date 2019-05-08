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
        postProcess: function(config) {
            // release to translations automatically after releasing to staging, since staging release is always with 'cleanup'
            if (global.release_target === 'staging') {
                config.aliases.release.push('shell:release_translations');
            }
        },
    });
};
