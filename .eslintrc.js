module.exports = {
    extends: ['@deriv/eslint-config-deriv'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            plugins: ['simple-import-sort'],
            rules: {
                'react/prop-types': 'off',
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            // Packages `react` related packages come first.
                            ['^react', '^[a-z]'],
                            // Packages from a "@deriv" scope come second.
                            ['^@\\w'],
                            // Absolute imports and other imports from aliases like 'Components/...'
                            ['^[A-Z]'],
                            // Internal packages.
                            ['^(@|components)(/.*|$)'],
                            // Side effect imports.
                            ['^\\u0000'],
                            // Parent imports. Put `..` last.
                            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                            // Other relative imports. Put same-folder imports and `.` last.
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                            // Style imports.
                            ['^.+\\.?(css)$'],
                        ],
                    },
                ],
            },
        },
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            extends: ['plugin:testing-library/react'],
        },
        {
            files: ['*.{ts,tsx}'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: [
                'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
                'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'plugin:react/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
            ],
            parserOptions: {
                ecmaversion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-export-namespace-from',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                    ],
                },
            },
            settings: {
                react: {
                    version: 'detect',
                },
                'import/resolver': {
                    typescript: {
                        // use an array
                        project: 'packages/**/tsconfig.json',
                    },
                    node: {
                        extensions: ['.ts', '.tsx'],
                        moduleDirectory: ['src', 'node_modules'],
                    },
                },
            },
        },
    ],
};
