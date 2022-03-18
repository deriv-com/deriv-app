const path = require('path');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { IS_RELEASE } = require('./constants');
// const { transformContentUrlBase } = require('./helpers');

const generateSWConfig = () => ({
    importWorkboxFrom: 'local',
    cleanupOutdatedCaches: true,
    exclude: [/CNAME$/, /index\.html$/, /404\.html$/, /^public\/images\/favicons\//, /^favicon\.ico$/],
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

// const htmlInjectConfig = () => ({ // commented out in trader/build/constants.js
//     links: [
//         {
//             path: 'favicon.ico',
//             attributes: {
//                 rel: 'icon',
//             },
//         },
//         ...[
//             { name: 'favicon', rel: 'icon', size: '16' },
//             { name: 'favicon', rel: 'icon', size: '32' },
//             { name: 'favicon', rel: 'icon', size: '96' },
//             { name: 'favicon', rel: 'icon', size: '160' },
//             { name: 'favicon', rel: 'icon', size: '192' },
//             { name: 'apple-touch-icon', size: '57' },
//             { name: 'apple-touch-icon', size: '60' },
//             { name: 'apple-touch-icon', size: '72' },
//             { name: 'apple-touch-icon', size: '76' },
//             { name: 'apple-touch-icon', size: '114' },
//             { name: 'apple-touch-icon', size: '120' },
//             { name: 'apple-touch-icon', size: '144' },
//             { name: 'apple-touch-icon', size: '152' },
//             { name: 'apple-touch-icon', size: '180' },
//         ].map(({ name, rel, size }) => ({
//             path: `public/images/favicons/${name}-${size}.png`,
//             attributes: {
//                 rel: rel || name,
//                 sizes: `${size}x${size}`,
//             },
//         })),
//     ],
//     append: false,
// });

const cssConfig = () => ({
    filename: 'trader/css/trader.main.[contenthash].css',
    chunkFilename: 'trader/css/trader.[name].[contenthash].css',
});

const stylelintConfig = () => ({
    configFile: path.resolve(__dirname, '../.stylelintrc.js'),
    formatter: stylelintFormatter,
    files: 'sass/**/*.s?(a|c)ss',
    failOnError: false, // Even though it's false, it will fail on error, and we need this to be false to display trace
});

module.exports = {
    htmlOutputConfig,
    // htmlInjectConfig,
    cssConfig,
    stylelintConfig,
    generateSWConfig,
};
