const webpackConfig = require('./webpack.config.js');

module.exports = {
    globals: {
        Blockly: false,
        trackJs: false,
        jest: false,
        dataLayer: false,
        goog: false,
        google: false,
        gapi: false,
        __webpack_public_path__: false,
    },
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    plugins: ['simple-import-sort'],
    rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },
    overrides: [
        {
            files: ['**/*.js', '**/*.ts', '**/*.tsx'],
            rules: {
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            [
                                // `react` first, `next` second, then packages starting with a character
                                '^react$',
                                '^next',
                                '^[a-z]',
                                // Packages starting with `@`
                                '^@',
                                // Packages starting with `~`
                                '^~',
                                // Imports starting with `../`
                                '^\\.\\.(?!/?$)',
                                '^\\.\\./?$',
                                // Imports starting with `./`
                                '^\\./(?=.*/)(?!/?$)',
                                '^\\.(?!/?$)',
                                '^\\./?$',
                                // Style imports
                                '^.+\\.s?css$',
                                // Side effect imports
                                '^\\u0000',
                            ],
                        ],
                    },
                ],
                //not sure we need it: show errors to each developer, i think we need only auto-fix

                // "sort-imports": ["error", {
                //     "ignoreCase": false,
                //     "ignoreDeclarationSort": true,
                //     "ignoreMemberSort": false,
                //     "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
                //     "allowSeparatedGroups": false
                // }]
            },
        },
    ],
};
