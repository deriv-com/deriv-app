const fs    = require('fs');
const path  = require('path');
const PATHS = require('./paths');

const getDirsSync = (path_to_dir) => (
    fs.readdirSync(path_to_dir)
        .filter(f => (
            fs.statSync(path.join(path_to_dir, f)).isDirectory()
        ))
);

const getApp2Aliases = () => {
    const app_2_path = path.resolve(PATHS.SRC, 'javascript/app_2');

    return getDirsSync(app_2_path)
        .filter(d => !/documents/i.test(d))
        .reduce(
            (aliases, folder_name) => ({
                ...aliases,
                [folder_name]: path.resolve(app_2_path, folder_name),
            }),
            {}
        );
};

const makeCacheGroup = (name, priority, ...matches) => ({
    [name]: {
        name,
        priority,
        chunks  : 'initial',
        enforce : true,
        filename: '[name].min.js',
        test    : new RegExp(`^${matches.map(m => `(?=.*${m})`).join('')}`),
    },
});

const publicPathFactory = (grunt) => () => (
    (global.is_release || grunt.file.exists(PATHS.ROOT, 'scripts/CNAME') ? '' : '/deriv-app') +
    (global.branch ? `/${global.branch_prefix}${global.branch}` : '') +
    '/js/'
);

module.exports = {
    getApp2Aliases,
    makeCacheGroup,
    publicPathFactory,
};
