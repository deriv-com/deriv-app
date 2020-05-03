const path = require('path');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { IS_RELEASE } = require('./constants');
// const { transformContentUrlBase } = require('./helpers');

const copyConfig = (base) => [];

const generateSWConfig = () => ({
    importWorkboxFrom: 'local',
    cleanupOutdatedCaches: true,
    exclude: [/CNAME$/, /index\.html$/, /404\.html$/],
    skipWaiting: true,
    clientsClaim: true,
});

const htmlOutputConfig = () => ({
    template: 'index.html',
    filename: 'index.html',
    minify: !IS_RELEASE
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
    ],
    scripts: [],
    append: false,
});

const cssConfig = () => ({ filename: 'css/account.main.css', chunkFilename: 'css/account.[name].[contenthash].css' });

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
    cssConfig,
    stylelintConfig,
    generateSWConfig,
};
