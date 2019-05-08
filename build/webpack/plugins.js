const CircularDependencyPlugin = require('circular-dependency-plugin');
const ManifestPlugin           = require('webpack-manifest-plugin');
const path                     = require('path');
const SWPrecachedWebpackPlugin = require('sw-precache-webpack-plugin');
const webpack                  = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const PATHS                    = require('./paths');
const languages                = require('../../scripts/common').languages;

const getPlugins = (app, grunt) => ([
    new CircularDependencyPlugin({
        failOnError: true,
    }),

    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        test    : /binary/,
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /ja/),

    ...(app === 'app_2'
        ? [
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
            }),

            ...(languages.map(lang => new SWPrecachedWebpackPlugin({
                cachedId                 : 'app_2',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                minify                   : false,
                navigateFallback         : '',
                filepath                 : path.resolve(PATHS.DIST, `app/${lang.toLowerCase()}/service-worker.js`),
                // TODO Uncomment below lines when changing the release process order to execute `js` task after `render`
                // staticFileGlobs          : [
                //     path.resolve(PATHS.DIST, `app/${lang.toLowerCase()}/index.html`),
                // ],
                // mergeStaticsConfig           : true,
                // stripPrefixMulti             : { [path.join(PATHS.DIST, `app/${lang.toLowerCase()}/`)]: `/app/${lang.toLowerCase()}/` },
                staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
                logger(message) {
                    if (message.indexOf('Total precache size is') === 0) {
                        // This message occurs for every build and is a bit too noisy.
                        return;
                    }
                    // eslint-disable-next-line no-console
                    console.log(message);
                },
            }))),
        ]
        : []
    ),
    ...(global.is_release
        ? [
            new webpack.DefinePlugin({
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
            }),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        ]
        : [
            function() {
                this.plugin('watch-run', (watching, callback) => {
                    // eslint-disable-next-line no-console
                    console.log('\n');
                    grunt.log.ok('Build started at:', new Date().toString().grey);

                    const changed_files = Object.keys(watching.watchFileSystem.watcher.mtimes);
                    if (changed_files.length) {
                        grunt.log.ok(`Changed file${changed_files.length > 1 ? 's' : ''}:`);
                        changed_files.forEach((file) =>{
                            const file_path = file.replace(process.cwd(), '.').match(/(.*\/)(.*(?!\/))$/);
                            grunt.log.write('   -'.green, file_path[1].grey, `\b${file_path[2]}\n`);
                        });
                    }

                    callback();
                });
            },

            ...(!grunt.option('analyze') ? [] : [
                new BundleAnalyzerPlugin({
                    analyzerMode  : 'static',
                    reportFilename: path.resolve(PATHS.ROOT, `../report_${app}.html`),
                    openAnalyzer  : false,
                }),
            ]),
        ]
    ),
]);

module.exports = getPlugins;
