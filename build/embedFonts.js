module.exports = function (grunt) {
    const app_2_file = `${global.dist}/css/app_2.css`;

    const config = {
        app: {},
        app_2: {
            files: {
                [app_2_file]: [app_2_file],
            },
        },
        get all() {
            return {
                ...this.app,
                ...this.app_2,
            };
        }
    };

    return { [global.section]: config[global.section] };
};
