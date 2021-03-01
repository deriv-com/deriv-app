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
        },
        optimization: {
            minimize: true,
        },
        devServer: {
            publicPath: '/dist/',
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
                                    if (svgPath.includes('components/icon/common')) {
                                        return 'common.svg';
                                    }
                                    if (svgPath.includes('components/icon/currency')) {
                                        return 'currency.svg';
                                    }
                                    if (svgPath.includes('components/icon/flag')) {
                                        return 'flag.svg';
                                    }
                                    if (svgPath.includes('components/icon/mt5')) {
                                        return 'mt5.svg';
                                    }
                                    if (svgPath.includes('components/icon/tradetype')) {
                                        return 'tradetype.svg';
                                    }
                                    if (svgPath.includes('components/icon/underlying')) {
                                        return 'underlying.svg';
                                    }
                                    return 'common.svg';
                                },
                                publicPath: '/icon/sprite/',
                            },
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [{ removeUselessStrokeAndFill: false }, { removeUnknownsAndDefaults: false }],
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
                'react-drag-drawer': 'react-drag-drawer',
                'react-pose': 'react-pose',
                'babel-polyfill': 'babel-polyfill',
                'prop-types': 'prop-types',
                'react-transition-group': 'react-transition-group',
                react: 'react',
                'react-content-loader': 'react-content-loader',
                'react-dom': 'react-dom',
                'react-dropzone': 'react-dropzone',
                '@deriv/shared': '@deriv/shared',
                'react-router-dom': 'react-router-dom',
                'react-swipeable': 'react-swipeable',
                'react-tiny-popover': 'react-tiny-popover',
                'react-window': 'react-window',
            },
            /^@deriv\/shared\/.+$/,
        ],
    }
};
