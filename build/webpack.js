const webpackMerge   = require('webpack-merge');
const app2Config     = require('./webpack/config_app_2');
const commonConfig   = require('./webpack/config_common');

module.exports = function (grunt) {
    const common_config = commonConfig(grunt);

    const config = {
        app_2: [webpackMerge.smart(common_config, app2Config(grunt))],
    };

    const section = config[global.section];

    const watch_config = {
        watch: true,
        optimization: {
            minimize: false,
        },
    };

    return {
        section,
        watch: section.map(conf => webpackMerge(conf, watch_config)),
    };
};
