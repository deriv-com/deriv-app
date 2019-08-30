module.exports = {
    parser: 'babel-eslint',
    env: {
        es6    : true,
        browser: true,
        amd    : true,
    },
    rules: {
        camelcase                           : 0,
        semi                                : ['error', 'always'],
        'array-callback-return'             : 0,
        'brace-style'                       : ['error', '1tbs', { allowSingleLine: true }],
        'eol-last'                          : ['error', 'always'],
        'func-names'                        : ['error', 'never'],
        'keyword-spacing'                   : ['error', { after: true }],
        'lines-between-class-members'       : ['error', 'always', { exceptAfterSingleLine: true }],
        'no-extra-semi'                     : 'error',
        'no-console'                        : 'error',
        'no-else-return'                    : ['error', { allowElseIf: true }],
        'no-multi-assign'                   : 0,
        'no-param-reassign'                 : ['error', { props: false }],
        'no-restricted-globals'             : 0,
        'no-script-url'                     : 0,
        'no-trailing-spaces'                : ['error', { skipBlankLines: true }],
        'object-curly-spacing'              : ['error', 'always', { arraysInObjects: true, objectsInObjects: true }],
        'one-var'                           : ['error', { initialized: 'never', uninitialized: 'always' }],
        'prefer-destructuring'              : 0,
        'space-in-parens'                   : ['error', 'never'],
        'space-infix-ops'                   : 'error',
        'space-unary-ops'                   : 'error',
        'no-multiple-empty-lines'           : ['error', { 'max': 1, 'maxEOF': 1 }],

        // import rules
        'import/no-extraneous-dependencies' : [0, { extensions: ['.jsx'] }],
        'import/no-useless-path-segments'   : 'error',
        'import/order'                      : ['error', { groups: [['builtin', 'external'], 'internal', 'sibling', 'parent'], 'newlines-between': 'ignore' }],
        'import/prefer-default-export'      : 0,
        'import/extensions'                 : ['error', 'never', { 'jsx': 'always', 'json': 'always' }],
    },
    extends: [
        'airbnb-base',
        "binary",
    ],
    parserOptions: {
        ecmaVersion : 6,
    },
    settings: {
        'import/resolver': {
            webpack: { config: 'webpack.config.js' }
        }
    },
};
