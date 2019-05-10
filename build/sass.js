const sass = require('node-sass');

module.exports = function () {
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
        app_2: generateConfig(['app_2.scss'], `${global.dist_app}/css`),
    };

    return { [global.section]: config[global.section] };
};
