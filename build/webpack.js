const path           = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack        = require('webpack');
const webpackMerge   = require('webpack-merge');
const appConfig      = require('./webpack/config_app');
const app2Config     = require('./webpack/config_app_2');
const commonConfig   = require('./webpack/config_common');
const PATHS          = require('./webpack/paths');
const getPlugins     = require('./webpack/plugins');

module.exports = function (grunt) {
    const common_config = commonConfig(grunt);

    const config = {
        app  : [webpackMerge.smart(common_config, appConfig(grunt))],
        app_2: [webpackMerge.smart(common_config, app2Config(grunt))],
        get all() {
            return [
                ...this.app,
                ...this.app_2,
            ];
        },
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
