module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true,
        'color-no-hex': true,
        'color-named': 'never',
        'max-nesting-depth': 3,
    },
};
