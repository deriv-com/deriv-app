module.exports = function (grunt) {
    const config = {
        app: {
            options: {
                minified  : true,
                plugins   : ['transform-remove-strict-mode'],
                presets   : ['env'],
                sourceMap : true,
                sourceType: 'script',
            },
            files  : [
                {
                    expand: true,
                    cwd   : 'src/javascript/landing_pages/',
                    src   : ['*.js'],
                    dest  : global.dist + '/js/landing_pages/'
                },
            ],
        },
        app_2: {},
        get all() {
            return this.app;
        },
    };

    return {
        landing_pages: config[global.section],
    };
};
