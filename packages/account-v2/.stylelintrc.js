module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true,
        'color-no-hex': true,
        'color-named': 'never',
        'max-nesting-depth': 3,
        'selector-class-pattern': [
            '^[A-Za-z]+((-){0,2}(_){0,2}[A-Za-z]+)*[A-Za-z]$',
            {
                message: 'Expected selector to match BEM CSS pattern',
            },
        ],
    },
};
