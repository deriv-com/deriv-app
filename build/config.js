const { transformContentUrlBase } = require('./helpers');
const path                        = require('path');
const { IS_RELEASE }              = require('./constants');

const copyConfig = (base) => ([
    { from: path.resolve(__dirname, '../node_modules/smartcharts-beta/dist/*.smartcharts.*'), to: 'js/smartcharts/', flatten: true },
    { from: path.resolve(__dirname, '../node_modules/smartcharts-beta/dist/smartcharts.css*'), to: 'css/', flatten: true },
    { from: path.resolve(__dirname, '../scripts/CNAME'), to: 'CNAME', toType: 'file' },
    { from: path.resolve(__dirname, '../src/root_files/404.html'), to: '404.html', toType: 'file' },
    { from: path.resolve(__dirname, '../src/root_files/robots.txt'), to: 'robots.txt', toType: 'file' },
    { from: path.resolve(__dirname, '../src/root_files/sitemap.xml'), to: 'sitemap.xml', toType: 'file' },
    { from: path.resolve(__dirname, '../src/public/images/favicons/favicon.ico'), to: 'favicon.ico', toType: 'file' },
    { from: path.resolve(__dirname, '../src/public/images/favicons/**') },
    { from: path.resolve(__dirname, '../src/public/images/common/logos/platform_logos/**') },
    { from: path.resolve(__dirname, '../src/_common/lib/pushwooshSDK/**'), flatten: true },
    {
        from: path.resolve(__dirname, '../src/templates/app/manifest.json'),
        to: 'manifest.json',
        toType: 'file',
        transform(content, path) {
            return transformContentUrlBase(content, path, base);
        }
    },
]);

const htmlOutputConfig = () => ({
    template: 'index.html',
    filename: 'index.html',
    minify: !IS_RELEASE ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
    }
});

const htmlInjectConfig = () => ({
    links: [
        'css/smartcharts.css',
        {
            path: 'manifest.json',
            attributes: {
                rel: 'manifest'
            }
        },
        {
            path: 'public/images/favicons',
            glob: '*',
            globPath: path.resolve(__dirname, '../src/public/images/favicons'),
            attributes: {
                rel: 'icon'
            }
        },
        {
            path: 'pushwoosh-web-notifications.js',
            attributes: {
                rel: 'preload',
                as: 'script'
            }
        },
    ],
    scripts: [
        {
            path: 'pushwoosh-web-notifications.js',
            attributes: {
                defer: '',
                type: 'text/javascript'
            }
        }
    ],
    append: true
});

const cssConfig = () => ({ filename: 'css/app.css', chunkFilename: 'css/[id].css' });

module.exports = {
    copyConfig,
    htmlOutputConfig,
    htmlInjectConfig,
    cssConfig,
};
