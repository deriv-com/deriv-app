module.exports = {
    root: true,
    extends: ['../../.eslintrc.js', 'eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        sourceType: 'module',
    },
    env: { es6: true },
    plugins: ['simple-import-sort', 'typescript-sort-keys'],
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
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/sort-type-constituents': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'lines-around-comment': ['error', { allowObjectStart: true }],
        'no-unneeded-ternary': 'error',
        'object-shorthand': 'error',
        'prefer-const': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-sort-props': 'warn',
        'simple-import-sort/exports': 'error',
        'sort-keys': 'warn',
        'typescript-sort-keys/interface': 'warn',
        'typescript-sort-keys/string-enum': 'warn',
        camelcase: 'warn',
    },
    overrides: [
        {
            files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
};
