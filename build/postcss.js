module.exports = function (grunt) {
    const src = {
        app  : `${global.dist}/css/{app,common,static}.css`,
        app_2: `${global.dist_app_2}/css/app_2.css`,
        get all() {
            return [
                this.app,
                this.app_2,
            ];
        },
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
