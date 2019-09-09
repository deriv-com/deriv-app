
/**
 * Icons entry object.
 * - to generate lib/icons/*.js files
 */

const glob = require('glob');
const toPascalCase = require('./to-pascal-case');
const entries = glob.sync('./src/components/icon/**/*.svg');

const entries_object = entries.reduce((acc, fname) => {
    const name = fname.match(/([^\/]*)\/*$/)[1].replace('.svg', '');
    acc[`icons/${toPascalCase(name)}`] = fname;
    return acc;
}, {});

module.exports = entries_object;
