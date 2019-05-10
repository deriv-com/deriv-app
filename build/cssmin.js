module.exports = function () {
    const files = {
        app_2: [
            { src: `${global.dist}/css/app_2.css`, dest: `${global.dist}/css/app_2.min.css` },
        ],
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
