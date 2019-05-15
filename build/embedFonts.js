module.exports = function () {
    const app_file = `${global.dist}/css/app.css`;

    const config = {
        app: {
            files: {
                [app_file]: [app_file],
            },
        },
    };

    return { [global.section]: config[global.section] };
};
