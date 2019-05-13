const isRelease = (grunt) => grunt.cli.tasks[0] === 'release';

const getReleaseTarget = (grunt) => {
    const release_target = Object.keys(global.release_config).find(grunt.option);

    if (!release_target) {
        grunt.fail.fatal(`Release target is wrong or not specified.\nValid targets are: ${Object.keys(global.release_config).map(t => `\n  --${t}`).join('')}`);
    }

    return release_target;
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
        ],
    ].join(' ')
);

module.exports = {
    isRelease,
    getReleaseTarget,
    getGhpagesCloneFolder,
    getDistPath,
    generateCompileCommand,
};
