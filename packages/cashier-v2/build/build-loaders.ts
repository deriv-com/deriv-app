import { RuleSetRule } from 'webpack';
import { TBuildOptions } from './types/build-types';

export const buildLoaders = (options: TBuildOptions): RuleSetRule[] => {
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
        ],
    };

    const sourceMapLoader = {
        loader: 'source-map-loader',
        test: (input: string) => options.isRelease && /\.js$/.test(input),
    };

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
        sourceMapLoader,
        styleLoader,
        {
            exclude: /node_modules/,
            generator: {
                filename: 'cashier-v2/assets/[name].[contenthash][ext]',
            },
            include: /assets\//,
            issuer: /\/packages\/cashier-v2\/.*(\/)?.*.scss/,
            test: /\.svg$/,
            type: 'asset/resource',
        },
        {
            exclude: /node_modules/,
            include: /assets\//,
            issuer: /\/packages\/cashier-v2\/.*(\/)?.*.tsx/,
            test: /\.svg$/,
            use: svgLoaders,
        },
    ];
};
