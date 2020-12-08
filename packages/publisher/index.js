#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const getDerivNodeModulesFolder = require('./utils/shared').getDerivNodeModulesFolder;
const getParsedPackageDotJson = require('./utils/shared').getParsedPackageDotJson;
const writeToPackageDotJson = require('./utils/shared').writeToPackageDotJson;
const getLocalDerivDependencies = require('./utils/shared').getLocalDerivDependencies;

const log = (...args) => console.log(...args);

const package_path = process.env.INIT_CWD;
const package_json = getParsedPackageDotJson(package_path);
const argument = process.argv.slice(2)[0];

switch (argument) {
    case 'prepublish': {
        // On "prepublish" we temporarily remove local "@deriv" packages from the caller package's "package.json".
        // If we don't do so and publish the package, an error will occur when trying to "npm install" the
        // published package as npm will look for these packages on the npm registry rather than locally.
        // This script should be used together with the utils in "webpack-utils" so Webpack knows how to
        // resolve imports to local "@deriv" packages.
        log();
        log(`Preparing ${package_json.name} for publishing...`);

        const local_deriv_dependencies = getLocalDerivDependencies(package_path);

        if (local_deriv_dependencies.length > 0) {
            local_deriv_dependencies.forEach(dep => {
                delete package_json.dependencies[dep];
                log(`  Removed local dependency: ${dep}`);
            });

            writeToPackageDotJson(package_path, package_json);

            const restore_path = path.resolve(package_path, 'node_modules', '.bin', 'deriv-publisher');

            log();
            log('At this point it is NOT recommended to exit this process as packages will remain removed.');
            log('  If you did exit this process, please run this command to restore packages:');
            log(`    "INIT_CWD=${package_path} node ${restore_path} postpublish"`);
        } else {
            log('  Found no local @deriv packages to remove.');
        }

        log('Prepublish finished.\n');
        break;
    }
    case 'postpublish': {
        // On "postpublish" we restore the local "@deriv" dependencies.
        log();
        log(`Restoring local @deriv dependencies for ${package_json.name}...`);

        const local_deriv_dependencies = getLocalDerivDependencies(package_path);

        if (local_deriv_dependencies.length > 0) {
            local_deriv_dependencies.forEach(dep => {
                // Fetch versions for each package from their own package.json
                // and restore them in the caller's package's "package.json".
                const dep_package_name = dep.split('/')[1]; // "@deriv/p2p" becomes "p2p"
                const deriv_node_modules_folder = getDerivNodeModulesFolder(package_path);
                const dep_package_path = path.resolve(deriv_node_modules_folder, dep_package_name);
                const dep_package_json = getParsedPackageDotJson(dep_package_path);
                const version_string = `^${dep_package_json.version}`;

                package_json.dependencies[dep] = version_string;

                log(`  Restored local dependency: ${dep}@${version_string}`);
            });

            // Sort dependencies alphabetically
            const package_names = Object.keys(package_json.dependencies);
            const sorted_keys = {};

            package_names.sort().forEach(key => (sorted_keys[key] = package_json.dependencies[key]));
            package_json.dependencies = sorted_keys;

            writeToPackageDotJson(package_path, package_json);
        } else {
            log('  Found no local @deriv packages to restore.');
        }

        log('Postpublish finished.\n');
        break;
    }
    default:
        break;
}
