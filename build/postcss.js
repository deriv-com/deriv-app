module.exports = function () {
    const src = {
        app: `${global.dist}/css/app.css`,
    };

    return {
        options: {
            processors: [
                require('autoprefixer')({ browsers: ['last 2 version', 'last 5 iOS versions', 'last 3 Safari versions'] })
            ],
        },
        dist: {
            src: src[global.section],
        },
    };
};
