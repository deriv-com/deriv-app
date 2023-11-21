module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true,
        'selector-class-pattern': [
            // selectors must be prefixed with "wallets-" to avoid name conflicts in other packages
            '^wallets-[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
            {
                message: 'Expected selector to match BEM CSS pattern and to be prefixed with "wallets-"',
            },
        ],
    },
};
