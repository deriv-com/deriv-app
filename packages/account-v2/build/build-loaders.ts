import { RuleSetRule } from 'webpack';
import { TBuildOptions } from './types/build-types';

const svgLoaderPlugins = [
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

export const svgLoader = () => [
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
        use: svgLoaderPlugins,
    },
];

export const babelLoader = () => ({
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
});

export const styleLoader = (isRelease: boolean, root: string) => ({
    test: /\.(sc|sa|c)ss$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                modules: {
                    auto: (path: string) => path.includes('.module.'),
                    localIdentName: isRelease ? '[hash:base64]' : '[path][name]__[local]',
                },
                url: true,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    config: root,
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
});

export const sourceMapLoader = (isRelease: boolean) => ({
    loader: 'source-map-loader',
    test: (input: string) => isRelease && input.endsWith('.js'),
});

export const buildLoaders = (options: TBuildOptions): RuleSetRule[] => {
    return [
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
        sourceMapLoader(options.isRelease),
        styleLoader(options.isRelease, options.paths.root),
        ...svgLoader(),
    ];
};
