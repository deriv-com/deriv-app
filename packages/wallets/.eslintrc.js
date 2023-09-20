module.exports = {
    root: true,
    extends: ['../../.eslintrc.js', 'eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        sourceType: 'module',
    },
    env: { es6: true },
    plugins: ['simple-import-sort'],
    rules: {
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    [
                        'public-path',
                        // `react` first, then packages starting with a character
                        '^react$',
                        '^[a-z]',
                        // Packages starting with `@`
                        '^@',
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
                        // Delete the empty line copied as the next line of the last import
                        '\\s*',
                    ],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        camelcase: 'warn',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/sort-type-constituents': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
    },
};
