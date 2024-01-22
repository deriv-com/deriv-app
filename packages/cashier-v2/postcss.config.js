/* eslint-disable sort-keys */
const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

module.exports = {
    //plugins order matters
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        ...(isRelease ? { cssnano: {} } : {}),
    },
};
