const path = require('path');

const resolvePath = (...args) => path.resolve(__dirname, '../..', ...args);

const PATHS = {
    ROOT: resolvePath(),
    SRC : resolvePath('src'),
    DIST: resolvePath(global.dist),
};

module.exports = PATHS;
