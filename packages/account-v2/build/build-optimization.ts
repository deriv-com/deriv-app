import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { TBuildOptions } from './types/build-types';

export const buildOptimization = (options: TBuildOptions): Configuration['optimization'] => ({
    minimize: options.isRelease,
    minimizer: options.isRelease
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
});
