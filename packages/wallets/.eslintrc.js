module.exports = {
    root: true,
    extends: ['../../.eslintrc.js', 'eslint:recommended', 'plugin:react/recommended'],
    parserOptions: { sourceType: 'module' },
    env: { es6: true },
    plugins: ['eslint-plugin-local-rules', 'simple-import-sort', 'sort-destructure-keys', 'typescript-sort-keys'],
    rules: {
        camelcase: 'error',
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
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'typeLike',
                format: ['PascalCase'],
                custom: {
                    regex: '^T[A-Z]',
                    match: true,
                    overrideReplaces: false,
                },
            },
        ],
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/*.spec.*', '**/*.test.*', '**/*.d.ts*'] }],
        'lines-around-comment': ['error', { allowObjectStart: true }],
        'local-rules/no-react-namespace': 'error',
        'no-unneeded-ternary': 'error',
        'no-useless-return': 'error',
        'object-shorthand': 'error',
        'prefer-const': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-sort-props': 'warn',
        'simple-import-sort/exports': 'error',
        'sort-destructure-keys/sort-destructure-keys': 'warn',
        'sort-keys': 'warn',
        'typescript-sort-keys/interface': 'warn',
        'typescript-sort-keys/string-enum': 'warn',
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
