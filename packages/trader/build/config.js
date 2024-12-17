const path = require('path');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { IS_RELEASE } = require('./loaders-config');

const generateSWConfig = () => ({
    importWorkboxFrom: 'local',
    cleanupOutdatedCaches: true,
    exclude: [/CNAME$/, /index\.html$/, /custom404\.html$/, /^public\/images\/favicons\//, /^favicon\.ico$/],
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

const cssConfig = () => ({
    filename: 'trader/css/trader.main.[contenthash].css',
    chunkFilename: 'trader/css/trader.[name].[contenthash].css',
    // filename: 'css/trader.main.[contenthash].css',
    // chunkFilename: 'css/trader.[name].[contenthash].css',
});

const stylelintConfig = () => ({
    configFile: path.resolve(__dirname, '../.stylelintrc.js'),
    formatter: stylelintFormatter,
    files: 'sass/**/*.s?(a|c)ss',
    failOnError: false, // Even though it's false, it will fail on error, and we need this to be false to display trace
});

module.exports = {
    htmlOutputConfig,
    cssConfig,
    stylelintConfig,
    generateSWConfig,
};
