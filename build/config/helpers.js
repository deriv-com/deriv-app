const Constants = require('./constants');

const isRelease = (grunt) => grunt.cli.tasks[0] === 'release';

const getReleaseTarget = (grunt) => {
    const release_target = Object.keys(global.release_config).find(grunt.option);

    if (!release_target) {
        grunt.fail.fatal(`Release target is wrong or not specified.\nValid targets are: ${Object.keys(global.release_config).map(t => `\n  --${t}`).join('')}`);
    }

    return release_target;
};

const validateSection = (grunt, section) => {
    let { valid_sections } = Constants.config;

    if (isRelease(grunt)) {
        valid_sections = [...global.release_config[global.release_target].valid_sections];

        if (!grunt.option('section')) { // To prevent mistakes, section is mandatory when releasing
            grunt.fail.fatal(`It is mandatory to specify the section when releasing. (--section=...)\nValid sections are: ${valid_sections.join(', ')}`);
        }
    }

    if (!valid_sections.includes(section)) {
        grunt.fail.fatal(`Unknown or wrong section: '${section}'.\nValid sections are: ${valid_sections.join(', ')}.`);
    }
};

const getSection = (grunt) => {
    const section = grunt.option('section') || Constants.config.default_section;
    validateSection(grunt, section);
    return section;
};

const getGhpagesCloneFolder = () => ( // clone each repo to a unique folder to prevent local cache issues when releasing
    `.grunt/grunt-gh-pages/gh-pages/${/^.*:(.*)\.git$/g.exec(global.release_info.target_repo)[1].replace(/\//g, '__')}`
);

const getDistPath = () => `dist${global.branch ? `/${global.branch_prefix}${global.branch}` : ''}`;

const generateCompileCommand = (params) => (
    [
        `cd ${process.cwd()}`,
        '&& ./scripts/render.js',
        ...[ // parameters
            params || '',
            global.branch ? `-b ${global.branch_prefix}${global.branch}` : '',
            global.path ? `-p ${global.path}` : '',
            `-s ${global.section}`,
        ],
    ].join(' ')
);

module.exports = {
    isRelease,
    getReleaseTarget,
    getSection,
    getGhpagesCloneFolder,
    getDistPath,
    generateCompileCommand,
};
