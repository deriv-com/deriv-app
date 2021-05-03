const fs = require('fs');
const path = require('path');
const getDerivNodeModulesFolder = require('./shared').getDerivNodeModulesFolder;
const getLocalDerivDependencies = require('./shared').getLocalDerivDependencies;

/**
 * Spread this function into a package's Webpack config's aliases.
 * This will instruct Webpack not to look in the node_modules for these
 * dependencies, but rather check a local file path.
 * @param {String} working_directory
 * @param {Boolean} is_publishing
 */
module.exports.getLocalDerivPackageAliases = (working_directory, is_publishing) => {
    if (!is_publishing) return {};

    const deriv_folder_path = getDerivNodeModulesFolder(working_directory);

    return getLocalDerivDependencies(working_directory).reduce((collection, dependency) => {
        const dependency_name = dependency.split('/')[1];
        const package_path = path.resolve(deriv_folder_path, dependency_name);
        collection[dependency] = fs.realpathSync(package_path);
        return collection;
    }, {});
};

/**
 * Spread this function into a package's Webpack config's externals.
 * This will instruct Webpack to only externalise packages when building
 * a non-published build, e.g. building @deriv/p2p for @deriv/core.
 * @param {String} working_directory
 * @param {Boolean} is_publishing
 * @param {Object} externals
 */
module.exports.getLocalDerivPackageExternals = (working_directory, is_publishing, externals = {}) => {
    const initial_externals = Object.keys(externals).reduce((collection, lib_name) => {
        if (externals[lib_name]) {
            collection[lib_name] = lib_name;
        }

        return collection;
    }, {});

    if (is_publishing) {
        return initial_externals;
    }

    return {
        ...getLocalDerivDependencies(working_directory).reduce((collection, dependency) => {
            collection[dependency] = dependency;
            return collection;
        }, {}),
        ...initial_externals,
    };
};
