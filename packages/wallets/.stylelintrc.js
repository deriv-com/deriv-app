module.exports = {
    extends: ['../../.stylelintrc.js'],
    rules: {
        'selector-class-pattern': [
            '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
            {
                resolveNestedSelectors: true,
                message: 'Expected selector to match BEM CSS pattern',
            },
        ],
    },
};
