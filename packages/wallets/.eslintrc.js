module.exports = {
    extends: '../../.eslintrc.js',
    plugins: ['@tanstack/query'],
    rules: {
        'sort-imports': 'error',
        '@tanstack/query/exhaustive-deps': 'error',
        '@tanstack/query/prefer-query-object-syntax': 'error',
    },
};
