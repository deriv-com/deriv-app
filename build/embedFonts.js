module.exports = function () {
    const app_2_file = `${global.dist}/css/app_2.css`;

    const config = {
        app_2: {
            files: {
                [app_2_file]: [app_2_file],
            },
        },
    };

    return { [global.section]: config[global.section] };
};
