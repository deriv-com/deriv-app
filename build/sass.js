const sass = require('node-sass');

module.exports = function (grunt) {
    const options = {
        style: 'expanded',
        implementation: sass,
    };

    const generateConfig = (src, dest) => ({
        options,
        files: [{
            expand: true,
            cwd   : 'src/sass',
            src,
            dest,
            ext   : '.css',
        }]
    });

    const config = {
        app  : generateConfig(['*.scss', '!app_2.scss'], `${global.dist}/css`),
        app_2: generateConfig(['app_2.scss'],            `${global.dist_app_2}/css`),
        get all() {
            return {
                options,
                files: [
                    ...this.app.files,
                    ...this.app_2.files,
                ],
            };
        },
    };

    return { [global.section]: config[global.section] };
};
