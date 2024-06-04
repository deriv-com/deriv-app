const path = require('path');

const resources = ['devices.scss', 'loaders.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
