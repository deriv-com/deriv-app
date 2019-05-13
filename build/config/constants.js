const release_targets = {
    production: {
        repo       : 'git@github.com:binary-com/deriv-app.git',
        target_repo: 'git@github.com:binary-com/deriv-app-production.git',
        CNAME      : 'deriv.app',
    },
    staging: {
        repo : 'git@github.com:binary-com/deriv-app.git',
        CNAME: 'staging.deriv.app',
    },
};

/**
 * branch        : the required branch that should be checked out when releasing
 * target_folder : the folder name in gh-pages to release to
 * origin        : the required origin that local clone should point to (also the target repo to release to, when `target_repo` not available)
 * target_repo   : the target repo to release to
 * CNAME         : creates a CNAME file based on this entry to push alongside the release when needed
 */
const release_config = {
    production: {
        branch       : 'master',
        target_folder: '',
        origin       : release_targets.production.repo,
        target_repo  : release_targets.production.target_repo,
        CNAME        : release_targets.production.CNAME,
    },
    staging: {
        branch       : 'dev',
        target_folder: '',
        origin       : release_targets.staging.repo,
        CNAME        : release_targets.staging.CNAME,
    },
    translations: {
        branch       : 'translations',
        target_folder: 'translations',
        origin       : release_targets.staging.repo,
        CNAME        : release_targets.staging.CNAME,
    },
};

const node_modules_paths = {
    smartcharts: 'node_modules/smartcharts-beta',
};

const config = {
    branch_prefix: 'br_',
    section      : 'app',
};

module.exports = {
    release_config,
    node_modules_paths,
    config,
};
