module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true,
        'selector-class-pattern': [
            // selectors must be prefixed with "p2p-v2-" to avoid name conflicts in other packages
            // derivs pattern is added to allow classname overrides for @deriv-com/ui components
            '^(p2p-v2|derivs|deriv)-[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
            {
                message: 'Expected selector to match BEM CSS pattern and to be prefixed with "p2p-v2-"',
            },
        ],
    },
};
