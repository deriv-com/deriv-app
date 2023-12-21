const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const svg_loaders = [
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            rootMode: 'upward',
        },
    },
    {
        loader: 'react-svg-loader',
        options: {
            jsx: true,
            svgo: {
                plugins: [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUnknownsAndDefaults: false },
                    { removeViewBox: false },
                ],
                floatPrecision: 3,
            },
        },
    },
];

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            index: path.resolve(__dirname, './src', 'index.tsx'),
            MockComponent: './src/lib/MockComponent.tsx',
        },
        mode: isRelease ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: base,
            filename: 'account-v2/js/[name].js',
            libraryExport: 'default',
            library: '@deriv/account-v2',
            libraryTarget: 'umd',
            chunkFilename: 'account-v2/js/account-v2.[name].[contenthash].js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    // https://github.com/webpack/webpack/issues/11467
                    test: /\.m?js/,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                rootMode: 'upward',
                            },
                        },
                    ],
                },
                //TODO: Uncomment this line when type script migrations on all packages done
                // plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
                {
                    test: input => isRelease && /\.js$/.test(input),
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                                modules: {
                                    auto: path => path.includes('.module.'),
                                    localIdentName: isRelease ? '[hash:base64]' : '[path][name]__[local]',
                                },
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname),
                                },
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true,
                                keepQuery: true,
                            },
                        },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [path.resolve(__dirname, 'src', 'lib', 'mock', 'mock.module.scss')],
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    issuer: /\/packages\/account-v2\/.*(\/)?.*.scss/,
                    exclude: /node_modules/,
                    include: /public\//,
                    type: 'asset/resource',
                    generator: {
                        filename: 'account-v2/public/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /\.svg$/,
                    issuer: /\/packages\/account-v2\/.*(\/)?.*.tsx/,
                    exclude: /node_modules/,
                    include: /public\//,
                    use: svg_loaders,
                },
            ],
        },
        optimization: {
            minimize: isRelease,
            minimizer: isRelease
                ? [
                      new TerserPlugin({
                          test: /\.js$/,
                          parallel: 2,
                      }),
                      new CssMinimizerPlugin(),
                  ]
                : [],
            splitChunks: {
                chunks: 'all',
                minSize: 102400,
                minSizeReduction: 102400,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                enforceSizeThreshold: 500000,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        minSize: 102400,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    shared: {
                        test: /[\\/]shared[\\/]/,
                        name: 'shared',
                        chunks: 'all',
                    },
                },
            },
        },
        devtool: isRelease ? 'source-map' : 'eval-cheap-module-source-map',
        externals: [
            {
                '@deriv/api': true,
                react: true,
                'react-dom': true,
                'react-router-dom': true,
            },
        ],
    };
};
