const path           = require('path');
const makeCacheGroup = require('./helpers').makeCacheGroup;
const PATHS          = require('./paths');
const getPlugins     = require('./plugins');

const appConfig = (grunt) => ({
    entry: {
        [global.is_release ? 'binary.min' : 'binary']: path.resolve(PATHS.SRC, 'javascript'),
    },
    output: {
        path: path.resolve(PATHS.DIST, 'js'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                ...makeCacheGroup('vendor', -20, 'node_modules'),
            },
        },
    },
    plugins: getPlugins('app', grunt),
});

module.exports = appConfig;
