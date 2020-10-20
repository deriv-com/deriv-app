// Create/restore a modified package.json for publishing P2P.
const fs = require('fs');
const path = require('path');

const getParsedPackageJson = absolute_file_path => JSON.parse(fs.readFileSync(absolute_file_path).toString());
const writeJson = data => fs.writeFileSync(package_json_path, JSON.stringify(data, null, 4));

const node_modules_path = path.resolve(__dirname, '..', 'node_modules');
const package_json_path = path.resolve(__dirname, '..', 'package.json');
const package_json = getParsedPackageJson(package_json_path);

const getLocalDerivDependencies = () =>
    fs
        .readdirSync(path.resolve(node_modules_path, '@deriv'), { withFileTypes: true })
        .filter(dir => dir.isSymbolicLink())
        .map(dir => `@deriv/${dir.name}`);

switch (process.argv.slice(2)[0]) {
    case 'prepublish': {
        getLocalDerivDependencies().forEach(dep => delete package_json.dependencies[dep]);
        writeJson(package_json);
        break;
    }
    case 'postpublish': {
        getLocalDerivDependencies().forEach(dep => {
            // Fetch versions for each package and restore dependencies.
            const dep_package_json_path = path.resolve(
                node_modules_path,
                `@deriv/${dep.split('/')[1]}`,
                'package.json'
            );
            const dep_package_json = getParsedPackageJson(dep_package_json_path);
            package_json.dependencies[dep] = `^${dep_package_json.version}`;
        });

        // Sort dependencies alphabetically
        const sorted_keys = {};
        Object.keys(package_json.dependencies)
            .sort()
            .forEach(key => (sorted_keys[key] = package_json.dependencies[key]));
        package_json.dependencies = sorted_keys;
        writeJson(package_json);
        break;
    }
    default:
        break;
}

process.exit(0);
