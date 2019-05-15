const path              = require('path');
const getAppAliases     = require('./helpers').getAppAliases;
const makeCacheGroup    = require('./helpers').makeCacheGroup;
const publicPathFactory = require('./helpers').publicPathFactory;
const PATHS             = require('./paths');
const getPlugins        = require('./plugins');

const appConfig = (grunt) => ({
    entry: {
        [global.is_release ? 'binary.min' : 'binary']: path.resolve(PATHS.SRC, 'javascript', 'app'),
    },
    output: {
        path         : path.resolve(PATHS.DIST, 'js'),
        publicPath   : publicPathFactory(grunt)(),
        chunkFilename: '[name]-[chunkhash].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                ...makeCacheGroup('binary_common', -5 , 'src/javascript/_common'),
                ...makeCacheGroup('smartcharts'  , -10, 'node_modules', 'smartcharts'),
                ...makeCacheGroup('react_mobx'   , -10, 'node_modules', '(react|mobx)'),
                ...makeCacheGroup('vendor'       , -20, 'node_modules'),
            },
        },
    },
    resolve: {
        alias: {
            _common: path.resolve(PATHS.SRC, 'javascript/_common'),
            ...getAppAliases(),
        },
    },
    plugins: getPlugins('app', grunt),
});

module.exports = appConfig;
