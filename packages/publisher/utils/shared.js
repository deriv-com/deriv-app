const fs = require('fs');
const path = require('path');

const getDerivNodeModulesFolder = package_path => {
    return path.resolve(package_path, 'node_modules', '@deriv');
};

const getDirContents = target_path => {
    return fs.readdirSync(target_path, { withFileTypes: true });
};

const getLocalDerivDependencies = package_path => {
    const deriv_node_modules_folder = getDerivNodeModulesFolder(package_path);

    if (fs.existsSync(deriv_node_modules_folder)) {
        // Below would only affect local development when npm linking a local @deriv/publisher.
        const ignore_packages = ['publisher'];

        return getDirContents(deriv_node_modules_folder).reduce((packages, directory) => {
            if (directory.isSymbolicLink() && !ignore_packages.includes(directory.name)) {
                packages.push(`@deriv/${directory.name}`);
            }

            return packages;
        }, []);
    }

    return [];
};

const getPackageDotJsonPath = package_path => {
    return path.resolve(package_path, 'package.json');
};

const getParsedPackageDotJson = package_path => {
    const package_json_path = getPackageDotJsonPath(package_path);
    return JSON.parse(fs.readFileSync(package_json_path).toString());
};

const writeToPackageDotJson = (package_path, package_json) => {
    const package_json_path = getPackageDotJsonPath(package_path);
    fs.writeFileSync(package_json_path, `${JSON.stringify(package_json, null, 4)}\n`);
};

module.exports = {
    getDerivNodeModulesFolder,
    getDirContents,
    getLocalDerivDependencies,
    getParsedPackageDotJson,
    writeToPackageDotJson,
};
