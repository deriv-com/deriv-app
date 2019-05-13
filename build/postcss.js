module.exports = function () {
    const src = {
        app_2: `${global.dist}/css/app_2.css`,
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
