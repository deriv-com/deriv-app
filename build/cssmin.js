module.exports = function () {
    const files = {
        app: [
            { src: `${global.dist}/css/app.css`, dest: `${global.dist}/css/app.min.css` },
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
