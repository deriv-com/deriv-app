const path = require('path');

const resources = ['modals.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
