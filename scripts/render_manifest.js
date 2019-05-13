const path      = require('path');
const writeFile = require('./common').writeFile;
const MANIFEST_TEMPLATE = require('../src/templates/app/manifest.json');

const compileManifests = async (dist_path, language, branch) => {
    const manifest = { ... MANIFEST_TEMPLATE };

    const start_url_base = branch ? `/${branch}/${language}` : `/${language}`;
    const root_url       = branch ? `/${branch}` : '';

    manifest.start_url = manifest.start_url.replace('{start_url_base}', start_url_base);
    manifest.icons     = manifest.icons.map(icon => ({ ...icon , ...{ src: icon.src.replace('{root_url}', root_url) } }));

    const file_path = path.join(dist_path, `${language}/manifest.json`);
    await writeFile(file_path, JSON.stringify(manifest));
};

module.exports = {
    compileManifests,
};
