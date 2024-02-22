import path from 'path';
import { TBuildEnv } from '../../build/types/build-types';
import { babelLoader, buildLoaders, sourceMapLoader, styleLoader, svgLoader } from '../../build/build-loaders';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

export default (env: TBuildEnv) => ({
    devtool: isRelease ? 'source-map' : 'eval-cheap-module-source-map',
    entry: {
        index: path.resolve(__dirname, 'src', 'index.ts'),
    },
    externals: [
        {
            '@deriv/api': true,
            '@deriv/library': true,
            react: true,
            'react-dom': true,
            'react-router-dom': true,
        },
    ],
    mode: isRelease ? 'production' : 'development',
    module: {
        rules: [
            {
                // https://github.com/webpack/webpack/issues/11467
                include: /node_modules/,
                resolve: {
                    fullySpecified: false,
                },
                test: /\.m?js/,
            },
            babelLoader(),
            //TODO: Uncomment this line when type script migrations on all packages done
            // plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
            sourceMapLoader(isRelease),
            styleLoader(isRelease, path.resolve(__dirname)),
            ...svgLoader(),
        ],
    },
    optimization: {
        minimize: isRelease,
        minimizer: isRelease
            ? [
                  new TerserPlugin({
                      parallel: 2,
                      test: /\.js$/,
                  }),
                  new CssMinimizerPlugin(),
              ]
            : [],
        splitChunks: {
            automaticNameDelimiter: '~',
            cacheGroups: {
                default: {
                    minChunks: 2,
                    minSize: 102400,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                defaultVendors: {
                    idHint: 'vendors',
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/,
                },
                shared: {
                    chunks: 'all',
                    name: 'shared',
                    test: /[\\/]shared[\\/]/,
                },
            },
            chunks: 'all',
            enforceSizeThreshold: 500000,
            maxAsyncRequests: 30,
            maxInitialRequests: 3,
            minChunks: 1,
            minSize: 102400,
            minSizeReduction: 102400,
        },
    },
    output: {
        chunkFilename: 'js/account-v2-lib.[name].[contenthash].js',
        filename: 'js/[name].js',
        library: '@deriv/account-v2-lib',
        libraryExport: 'default',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        publicPath: env?.base && env.base !== true ? `/${env.base}/` : '/',
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
});
