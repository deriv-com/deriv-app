const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function () {
    return {
        entry: {
            'icon/js/icons': 'Components/icon/icons.js',
        },
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: '[name].js',
            libraryExport: 'default',
            library: '@deriv/component',
            libraryTarget: 'umd',
        },
        resolve: {
            alias: {
                Components: path.resolve(__dirname, 'src', 'components'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        optimization: {
            minimize: true,
        },
        devServer: {
            static: {
                publicPath: '/dist/',
            },
        },

        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                extract: true,
                                spriteFilename: svgPath => {
                                    const category = /components\/icon\/([\w-]*)/.exec(svgPath)[1];

                                    return category ? `${category}.[contenthash].svg` : 'common.[contenthash].svg';
                                },
                                publicPath: '/icon/sprites/',
                            },
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [
                                    {
                                        name: 'removeUselessStrokeAndFill',
                                        params: {
                                            attrs: 'false',
                                        },
                                    },
                                    {
                                        name: 'removeUnknownsAndDefaults',
                                        params: {
                                            attr: false,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new SpriteLoaderPlugin({ plainSprite: true }),
            // ...(!is_release ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
        ],
        externals: [
            {
                formik: 'formik',
                classnames: 'classnames',
                'react-div-100vh': 'react-div-100vh',
                'framer-motion': 'framer-motion',
                'prop-types': 'prop-types',
                'react-transition-group': 'react-transition-group',
                react: 'react',
                'react-content-loader': 'react-content-loader',
                'react-dom': 'react-dom',
                'react-dropzone': 'react-dropzone',
                '@deriv/shared': '@deriv/shared',
                '@deriv/translations': '@deriv/translations',
                'react-router-dom': 'react-router-dom',
                'react-swipeable': 'react-swipeable',
                'react-tiny-popover': 'react-tiny-popover',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
    };
};
