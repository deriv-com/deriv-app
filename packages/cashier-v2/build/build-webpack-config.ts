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
            classnames: true,
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
        chunkFilename: 'cashier-v2/js/cashier-v2.[name].[contenthash].js',
        filename: 'cashier-v2/js/[name].js',
        library: '@deriv/cashier-v2',
        libraryExport: 'default',
        libraryTarget: 'umd',
        path: options.paths.output,
        publicPath: options.base,
    },
    //TODO: Uncomment this line when type script migrations on all packages done
    // plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
    resolve: buildResolvers(),
});
