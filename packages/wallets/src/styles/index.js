const path = require('path');

const resources = ['devices.scss', 'variables.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
