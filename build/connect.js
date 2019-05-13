const rewrite     = require('connect-modrewrite');
const serveIndex  = require('serve-index');
const serveStatic = require('serve-static');
const languages   = require('../scripts/common').languages;

module.exports = function (grunt) {
    lang_regex = languages.join('|').toLowerCase();

    return {
        livereload: {
            options: {
                hostname  : '0.0.0.0',
                port      : 443,
                protocol  : 'https',
                base      : 'dist',
                open      : {
                    appName: {
                        app: 'Google\ Chrome'
                    },
                    target : 'https://localhost',
                },
                middleware: (connect, options) => {
                    const middlewares = [
                        require('connect-livereload')(),
                    ];

                    const rules = [
                        '^/deriv-app/(.*)$ /$1',
                        `^/(${lang_regex})/index(\\.html)?/(.*)$ /$1/$2 [L]`,
                        `^/(${lang_regex})/service-worker\\.js$ - [L]`,
                        `^/(${lang_regex})/manifest\\.json$ - [L]`,
                        `^/(${lang_regex})/.*$ /$1/ [L]`,
                    ];
                    middlewares.push(rewrite(rules));

                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    options.base.forEach((base) => {
                        middlewares.push(serveStatic(base));
                    });

                    const directory = options.directory || options.base[options.base.length - 1];
                    middlewares.push(serveIndex(directory));

                    middlewares.push((req, res) => {
                        const path_404 = `${options.base[0]}/404.html`;
                        if (grunt.file.exists(path_404)) {
                            require('fs').createReadStream(path_404).pipe(res);
                            return;
                        }
                        res.statusCode(404); // 404.html not found
                        res.end();
                    });

                    return middlewares;
                }
            }
        },
    };
};
