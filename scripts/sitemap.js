#!/usr/bin/env node

const color   = require('cli-color');
const Sitemap = require('sitemap');
const program = require('commander');
const fs      = require('fs');
const Path    = require('path');
const common  = require('./common');
const urls    = require('./config/sitemap_urls');

program
    .version('0.2.0')
    .description('Generate sitemap.xml')
    .parse(process.argv);

const config = [
    {
        url_prefix: 'https://www.deriv.com/',
        filename  : 'sitemap.app_2.xml',
        section   : 'app_2',
    },
];
let excluded;

const getApplicableLanguages = (lang_filter) => common.languages.filter(lang => new RegExp(lang_filter, 'i').test(lang));

const urlFor = (section, lang, path) => {
    if (section === 'app') {
        return `${lang}/${path}.html`;
    }
    // else: app_2
    return `app/${lang}/${path}`;
};

const createSitemap = (conf) => {
    excluded = 0;

    const sitemap = Sitemap.createSitemap({
        hostname : conf.url_prefix,
        cacheTime: 600000,
    });

    getApplicableLanguages(conf.lang_filter)
        .map(lang => lang.toLowerCase())
        .forEach((lang) => {
            urls[conf.section].forEach((entry) => {
                if (!common.isExcluded(entry[3], lang)) {
                    sitemap.add({
                        url       : `${conf.url_prefix}${urlFor(conf.section, lang, entry[0])}`,
                        changefreq: entry[1],
                        priority  : entry[2],
                    });
                } else {
                    excluded++;
                }
            });
        });

    fs.writeFileSync(Path.join(common.root_path, 'src/root_files', conf.section, conf.filename), sitemap.toString());
};

config.forEach((conf) => {
    const start = Date.now();
    process.stdout.write(common.messageStart(`Generating ${conf.section}/${conf.filename}`, true));

    createSitemap(conf);

    process.stdout.write(common.messageEnd(Date.now() - start));

    // Report details
    const langs_count = getApplicableLanguages(conf.lang_filter).length;
    const total_count = langs_count * urls[conf.section].length - excluded;
    console.log(`  ${color.green(total_count)} URL nodes total (${color.cyan(langs_count)} Languages ${color.yellowBright('*')} ${color.cyan(urls.length)} URLs ${color.yellowBright('-')} ${color.cyan(excluded)} Excluded)\n`); // eslint-disable-line no-console
});
