module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true,
        'max-nesting-depth': 3,
        'selector-class-pattern': [
            // selectors must be prefixed with "cashier-v2-" to avoid name conflicts in other packages
            '^cashier-v2-[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
            {
                message: 'Expected selector to match BEM CSS pattern and to be prefixed with "cashier-v2-"',
            },
        ],
    },
};
