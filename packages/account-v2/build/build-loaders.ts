import { RuleSetRule } from 'webpack';
import { TBuildOptions } from './types/build-types';

export const buildLoaders = (options: TBuildOptions): RuleSetRule[] => {
    const svgLoaders = [
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
                    floatPrecision: 3,
                    plugins: [
                        { removeTitle: false },
                        { removeUselessStrokeAndFill: false },
                        { removeUnknownsAndDefaults: false },
                        { removeViewBox: false },
                    ],
                },
            },
        },
    ];
    const babelLoader = {
        exclude: /node_modules/,
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    rootMode: 'upward',
                },
            },
        ],
    };
    const styleLoader = {
        test: /\.(sc|sa|c)ss$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (path: string) => path.includes('.module.'),
                        localIdentName: options.isRelease ? '[hash:base64]' : '[path][name]__[local]',
                    },
                    url: true,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        config: options.paths.root,
                    },
                },
            },
            {
                loader: 'resolve-url-loader',
                options: {
                    keepQuery: true,
                    sourceMap: true,
                },
            },
            'sass-loader',
            {
                loader: 'sass-resources-loader',
                options: {
                    // Provide path to the file with resources
                    resources: [
                        // eslint-disable-next-line global-require, import/no-dynamic-require
                        ...require('../../shared/src/styles/index.js'),
                    ],
                },
            },
        ],
    };
    const sourceMapLoader = {
        loader: 'source-map-loader',
        test: (input: string) => options.isRelease && input.endsWith('.js'),
    };

    return [
        {
            // https://github.com/webpack/webpack/issues/11467
            include: /node_modules/,
            resolve: {
                fullySpecified: false,
            },
            test: /\.m?js/,
        },
        babelLoader,
        //TODO: Uncomment this line when type script migrations on all packages done
        // plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
        sourceMapLoader,
        styleLoader,
        {
            exclude: /node_modules/,
            generator: {
                filename: 'account-v2/assets/[name].[contenthash][ext]',
            },
            include: /assets\//,
            issuer: /\/packages\/account-v2\/[^/]+(?:\/[^/]+)*\.scss/,
            test: /\.svg$/,
            type: 'asset/resource',
        },
        {
            exclude: /node_modules/,
            include: /assets\//,
            issuer: /\/packages\/account-v2\/[^/]+(?:\/[^/]+)*\.tsx/,
            test: /\.svg$/,
            use: svgLoaders,
        },
    ];
};
