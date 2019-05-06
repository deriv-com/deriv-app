const release_targets = {
    production: {
        repo : 'git@github.com:binary-static-deployed/binary-static.git',
        CNAME: 'www.binary.com',
    },
    staging: {
        repo : 'git@github.com:binary-com/binary-static.git',
        CNAME: 'staging.binary.com',
    },
    binarynex: {
        repo : 'git@github.com:binary-com/binarynex-deployed.git',
        CNAME: 'www.binarynex.com',
    },
};

/**
 * branch        : the required branch that should be checked out when releasing
 * target_folder : the folder name in gh-pages to release to
 * valid_sections: the list of sections that can use for this release
 * origin        : the required origin that local clone should point to (also the target repo to release to, when `target_repo` not available)
 * target_repo   : the target repo to release to
 * CNAME         : creates a CNAME file based on this entry to push alongside the release when needed
 */
const release_config = {
    production: {
        branch        : 'master',
        target_folder : '',
        valid_sections: ['app', 'app_2', 'all'],
        origin        : release_targets.production.repo,
        CNAME         : release_targets.production.CNAME,
    },
    staging: {
        branch        : 'master',
        target_folder : '',
        valid_sections: ['app', 'app_2', 'all'],
        origin        : release_targets.staging.repo,
        CNAME         : release_targets.staging.CNAME,
    },
    translations: {
        branch        : 'translations',
        target_folder : 'translations',
        valid_sections: ['app'],
        origin        : release_targets.staging.repo,
        CNAME         : release_targets.staging.CNAME,
    },
    nex_production: {
        branch        : 'master',
        target_folder : '',
        valid_sections: ['app_2'],
        origin        : release_targets.staging.repo,
        target_repo   : release_targets.binarynex.repo,
        CNAME         : release_targets.binarynex.CNAME,
    },
    nex_beta: {
        branch        : 'master',
        target_folder : 'beta',
        valid_sections: ['app_2'],
        origin        : release_targets.staging.repo,
        target_repo   : release_targets.binarynex.repo,
        CNAME         : release_targets.binarynex.CNAME,
    },
};

const node_modules_paths = {
    binary_style: 'node_modules/@binary-com/binary-style',
    smartcharts : 'node_modules/smartcharts-beta',
};

const config = {
    branch_prefix  : 'br_',
    valid_sections : ['all', 'app', 'app_2'],
    default_section: 'all',
    app_2_folder   : 'app',
};

module.exports = {
    release_config,
    node_modules_paths,
    config,
};
