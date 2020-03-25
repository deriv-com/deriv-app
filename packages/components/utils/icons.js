const glob = require('glob');

const icons = glob.sync('./src/components/icon/**/*.svg');

const entries_object = icons.reduce((acc, fname) => {
    const name = fname.match(/([^/]*)\/*$/)[1].replace('.svg', '');
    acc[`icon/js/${name}`] = fname;
    return acc;
}, {});

module.exports = entries_object;
