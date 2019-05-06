module.exports = function (grunt){
    return {
        css: {
            files: ['src/sass/**/*.scss'],
            tasks: ['stylelint', 'css']
        },
        landing_pages: {
            files: ['src/javascript/landing_pages/*.js'],
            tasks: ['babel:landing_pages']
        },
        options: {
            spawn        : false,
            interrupt    : true,
            debounceDelay: 250,
            livereload: {
                key : grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key'),
                cert: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt')
            },
        }
    };
};
