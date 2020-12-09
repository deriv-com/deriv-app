const path = require('path');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: path.resolve(__dirname, 'build/webpack.config-test.js') },
        }
    },
};
