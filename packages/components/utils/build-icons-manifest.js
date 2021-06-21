const { EOL } = require('os');
const path = require('path');
const fs = require('fs');

const glob = require('glob');

const sprite_bundles = glob.sync('./lib/icon/sprite/**/*.svg');

const svgs_map = sprite_bundles.reduce((acc, fname) => {
    const name = fname.match(/([^/]*)\/*$/)[1].replace('.svg', '');
    const svg_category = name.match(/^(.*?)\./)[1];
    acc[svg_category] = name;
    return acc;
}, {});

function buildIconsManifest() {
    const buffer = ['// auto-generated file. DO NOT MODIFY.', ''];
    buffer.push(`module.exports = ${JSON.stringify(svgs_map)}`);

    fs.writeFileSync(path.join(__dirname, '../src/components/icon/icons-manifest.js'), buffer.join(EOL) + EOL);
}

module.exports.buildIconsManifest = buildIconsManifest;
