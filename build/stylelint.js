const stylelintFormatter = require('stylelint-formatter-pretty');

module.exports = {
    options: {
        formatter: stylelintFormatter
    },
    all: {
        src: [
            'src/sass/**/*.scss',
            '!src/sass/**/external/**/*.scss',
        ],
    },
};
