module.exports = {
    env: { browser: true, es6: true, jest: true },
    extends: [
        '../../.eslintrc.js',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:sonarjs/recommended',
    ],
    overrides: [
        {
            files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { sourceType: 'module' },
    plugins: [
        'eslint-plugin-local-rules',
        'sonarjs',
        'simple-import-sort',
        'sort-destructure-keys',
        'typescript-sort-keys',
    ],
    root: true,
    ignorePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.js',
        '**/*.config.*',
        '**/*.classnames.ts',
        '**/*.mock.*',
    ],
    rules: {
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/sort-type-constituents': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variable',
                modifiers: ['destructured'],
                format: ['camelCase', 'snake_case'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'function',
                format: ['camelCase', 'PascalCase'],
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
        'react/jsx-sort-props': 'error',
        'simple-import-sort/exports': 'error',
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
        'sort-destructure-keys/sort-destructure-keys': 'error',
        'sort-keys': 'error',
        'typescript-sort-keys/interface': 'error',
        'typescript-sort-keys/string-enum': 'error',
    },
};
