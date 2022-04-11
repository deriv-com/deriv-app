const path = require('path');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { transformContentUrlBase } = require('./helpers');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

const copyConfig = base => {
    const patterns = [
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/bot/css/'),
            to: 'bot/css/',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/bot/media/'),
            to: 'media',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/bot-web-ui/dist/bot/js/'),
            to: 'bot/js/',
        },
        {
            from: path.resolve(__dirname, '../../../node_modules/@deriv/deriv-charts/dist'),
            to: 'js/smartcharts/',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/account/dist/account/js/'),
            to: 'account/js',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/account/dist/account/css/'),
            to: 'account/css',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/cashier/js/'),
            to: 'cashier/js',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/cashier/css/'),
            to: 'cashier/css',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/cashier/dist/cashier/public'),
            to: 'cashier/public',
            transformPath(context) {
                return context.split('node_modules/@deriv/cashier/dist/')[1];
            },
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/trader/dist/trader'),
            to: 'trader',
        },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/appstore/dist/appstore'),
            to: 'appstore',
        },
        { from: path.resolve(__dirname, '../scripts/CNAME'), to: 'CNAME', toType: 'file', noErrorOnMissing: true },
        {
            from: path.resolve(__dirname, '../src/public/.well-known/apple-app-site-association'),
            to: '.well-known/apple-app-site-association',
            toType: 'file',
        },
        {
            from: path.resolve(__dirname, '../src/public/.well-known/assetslinks.json'),
            to: '.well-known/assetlinks.json',
            toType: 'file',
        },
        {
            from: path.resolve(__dirname, '../src/public/.well-known/apple-app-site-association'),
            to: 'apple-app-site-association',
            toType: 'file',
        },
        {
            from: path.resolve(__dirname, '../src/public/.well-known/assetslinks.json'),
            to: 'assetlinks.json',
            toType: 'file',
        },
        { from: path.resolve(__dirname, '../src/root_files/404.html'), to: '404.html', toType: 'file' },
        {
            from: path.resolve(__dirname, '../src/root_files/localstorage-sync.html'),
            to: 'localstorage-sync.html',
            toType: 'file',
        },
        { from: path.resolve(__dirname, '../src/root_files/robots.txt'), to: 'robots.txt', toType: 'file' },
        { from: path.resolve(__dirname, '../src/root_files/sitemap.xml'), to: 'sitemap.xml', toType: 'file' },
        {
            from: path.resolve(__dirname, '../src/public/images/favicons/favicon.ico'),
            to: 'favicon.ico',
            toType: 'file',
        },
        { from: path.resolve(__dirname, '../src/public/images/favicons/'), to: 'public/images/favicons' },
        {
            from: path.resolve(__dirname, '../src/public/images/common/static_images/'),
            to: 'public/images/common',
        },
        // { from: path.resolve(__dirname, '../src/public/images/common/og_image.gif'), to: 'images/common/og_image.gif' }, // Once the design for og_image is ready, bring this back.
        {
            from: path.resolve(__dirname, '../src/public/images/common/logos/platform_logos/'),
            to: 'public/images/common/logos/platform_logos/',
        },
        { from: path.resolve(__dirname, '../src/public/images/app/header/'), to: 'public/images/app/header/' },
        {
            from: path.resolve(__dirname, '../node_modules/@deriv/components/lib/icon/sprites'),
            to: 'public/sprites',
            toType: 'dir',
        },
        {
            from: path.resolve(__dirname, '../src/templates/app/manifest.json'),
            to: 'manifest.json',
            toType: 'file',
            transform(content, transform_path) {
                return transformContentUrlBase(content, transform_path, base);
            },
        },
    ];

    return {
        patterns,
        options: {
            concurrency: 100,
        },
    };
};

const generateSWConfig = is_release => ({
    cleanupOutdatedCaches: true,
    exclude: [
        /CNAME$/,
        /index\.html$/,
        /404\.html$/,
        /^localstorage-sync\.html$/,
        /\.map$/,
        /sitemap\.xml$/,
        /robots\.txt$/,
        /manifest\.json$/,
        /^apple-app-site-association/,
        /^assetlinks.json/,
        /^.well-known\//,
        /^account\//,
        /^js\/smartcharts\//,
        /^bot\//,
        /^media\//,
        /^trader\//,
        /^cashier\//,
        /^js\/core\.[a-z_]*-json\./,
    ],
    skipWaiting: true,
    clientsClaim: true,
    ...(is_release && {
        importScripts: [`https://cdn.pushwoosh.com/webpush/v3/pushwoosh-service-worker.js`],
    }),
});

const htmlOutputConfig = is_release => ({
    template: 'index.html',
    filename: 'index.html',
    meta: is_release
        ? {
              versionMetaTAG: {
                  name: 'version',
                  content: gitRevisionPlugin.version(),
              },
          }
        : {},
    minify: !is_release
        ? false
        : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
          },
});

const htmlInjectConfig = () => ({
    links: [
        {
            path: 'manifest.json',
            attributes: {
                rel: 'manifest',
            },
        },
        {
            path: 'public/images/favicons',
            glob: '*',
            globPath: path.resolve(__dirname, '../src/public/images/favicons'),
            attributes: {
                rel: 'icon',
            },
        },
    ],
    append: false,
});

const htmlPreloadConfig = () => ({
    rel: 'preload',
    include: 'initial',
    as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        return 'script';
    },
    fileWhitelist: [/\.css$/],
});

const cssConfig = () => ({
    filename: 'css/core.[name].[contenthash].main.css',
    chunkFilename: 'css/core.chunk.[name].[contenthash].css',
});

const stylelintConfig = () => ({
    configFile: path.resolve(__dirname, '../.stylelintrc.js'),
    formatter: stylelintFormatter,
    files: 'sass/**/*.s?(a|c)ss',
    failOnError: false, // Even though it's false, it will fail on error, and we need this to be false to display trace
});

module.exports = {
    copyConfig,
    htmlOutputConfig,
    htmlInjectConfig,
    htmlPreloadConfig,
    cssConfig,
    stylelintConfig,
    generateSWConfig,
};
