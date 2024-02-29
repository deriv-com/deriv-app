import { Configuration } from 'webpack';
import { TBuildOptions } from './types/build-types';
import { buildLoaders } from './build-loaders';
import { buildOptimization } from './build-optimization';
import { buildResolvers } from './build-resolvers';

export const buildWebpackConfig = (options: TBuildOptions): Configuration => ({
    devtool: options.isRelease ? 'source-map' : 'eval-cheap-module-source-map',
    entry: {
        index: options.paths.entry,
    },
    externals: [
        {
            react: true,
            'react-dom': true,
            'react-router-dom': true,
        },
    ],
    mode: options.isRelease ? 'production' : 'development',
    module: {
        rules: buildLoaders(options),
    },
    optimization: buildOptimization(options),
    output: {
        chunkFilename: 'account-v2/js/account-v2.[name].[contenthash].js',
        filename: 'account-v2/js/[name].js',
        library: '@deriv/account-v2',
        libraryExport: 'default',
        libraryTarget: 'umd',
        path: options.paths.output,
        publicPath: options.base,
    },

    resolve: buildResolvers(),
});
