module.exports = function (grunt) {
    const files = {
        app: [
            {
                src: [
                    `${global.dist}/css/common.css`,
                    `${global.node_modules_paths.binary_style}/binary.css`,
                    `${global.node_modules_paths.binary_style}/binary.more.css`,
                ],
                dest: `${global.dist}/css/common.min.css`,
            },
            { src: `${global.dist}/css/app.css`,    dest: `${global.dist}/css/app.min.css` },
            { src: `${global.dist}/css/static.css`, dest: `${global.dist}/css/static.min.css` },
        ],
        app_2: [
            { src: `${global.dist_app_2}/css/app_2.css`, dest: `${global.dist_app_2}/css/app_2.min.css` },
        ],
        get all() {
            return [
                ...this.app,
                ...this.app_2,
            ];
        },
    };

    return {
        [global.section]: {
            options: {
                inline: ['none'],
            },
            files: files[global.section],
        },
    };
};
