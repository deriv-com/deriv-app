module.exports = function (grunt) {
    const colors = {
        error: '\\033[0;31m',
        info : '\\033[0;32m',
        warn : '\\033[1;33m',
        reset: '\\033[0m',
    };
    const prompt = (message, type) => (`echo "${colors[type || 'info']}>>${colors.reset} ${message}"`);
    const ghpagesCommand = () => (
        [
            `cd ${process.cwd()}/.grunt/grunt-gh-pages/gh-pages/${global.is_release ? global.release_info.clone_folder : 'main'}`,
            prompt('Updating...'),
            'git fetch origin gh-pages --quiet',
            'git reset --hard origin/gh-pages --quiet'
        ].join(' && ')
    );
    const release_branch = global.release_info ? global.release_info.branch : '';

    return {
        compile_dev: {
            command: global.compileCommand('-d'),
            options: {
                stdout: true
            }
        },
        compile_production: {
            command: global.compileCommand(),
            options: {
                stdout: true
            }
        },
        sitemap: {
            command: `cd ${process.cwd()} && ./scripts/sitemap.js`,
            options: {
                stdout: true
            }
        },
        trigger_tests: {
            command: grunt.option('staging') ? 'grunt gh-pages:trigger_tests --staging' : prompt('Tests are triggered only when releasing to Staging.', 'warn'),
            options: {
                stdout: true
            }
        },
        make_cname: {
            command: 'git config --get remote.origin.url',
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        if(grunt.option('cleanup') || grunt.option('reset')) {
                            var origin = stdout.replace('\n', ''),
                                CNAME;
                            if (origin === global.release_info.origin) {
                                CNAME = global.release_info.CNAME;
                            }
                            if (CNAME) {
                                grunt.file.write(global.dist + '/CNAME', CNAME + "\n");
                                grunt.log.ok(`CNAME file created: ${CNAME}`);
                            } else {
                                grunt.log.error('CNAME file is not created: remote origin does not match.');
                            }
                        }
                    }
                    cb();
                },
                stdout: false
            }
        },
        check_origin: {
            command: 'git config --get remote.origin.url',
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        var origin = stdout.replace('\n', '');
                        grunt.log.ok(`Remote origin: ${origin}`);
                        if (global.is_release) {
                            if (origin !== global.release_info.origin) {
                                grunt.fail.fatal(`Your remote origin does not match the required repository for '--${global.release_target}'.\nShould be: ${global.release_config[global.release_target].origin}`);
                            }
                        } else {
                            // origin cannot be one of release targets, when it's not a release
                            if (Object.keys(global.release_config).some(target => global.release_config[target].origin === origin || global.release_config[target].target_repo === origin)) {
                                grunt.fail.fatal(`Your remote origin should be your fork.`);
                            }
                        }
                    }
                    cb();
                },
                stdout: false
            }
        },
        check_branch: {
            command: 'git symbolic-ref --short HEAD',
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        var branch = stdout.replace('\n', '');
                        grunt.log.ok('Current branch: ' + branch);
                        if (branch !== global.release_info.branch) {
                            grunt.fail.fatal(`Current branch is not correct.\nIn order to release to ${global.release_target.toUpperCase()}, please checkout the "${global.release_info.branch}" branch.`);
                        }
                    }
                    cb();
                },
                stdout: false
            }
        },
        check_updated: {
            command: `git fetch origin ${release_branch} -q && git rev-list HEAD...origin/${release_branch} --count`,
            options: {
                callback: function (err, stdout, stderr, cb) {
                    if(!err) {
                        const diff = stdout.replace('\n', '');
                        if (+diff === 0) {
                            grunt.log.ok('Local branch is updated to the latest commit on origin.');
                        } else {
                            grunt.fail.fatal(`Local branch (${global.release_info.branch}) has ${diff} commits difference with the latest commit on origin. Please update and try again.`);
                        }
                    }
                    cb();
                },
                stdout: false
            }
        },
        release_translations: {
            command: [
                prompt('Starting the release to \'translations\'\n'),
                'git fetch origin translations:translations',
                'git checkout translations',
                'grunt release --translations --section=app --color',
                'git checkout master',
            ].join(' && '),
            options: {
                stdout: true
            }
        },
        reset_ghpages: {
            command: grunt.option('reset') ?
                (grunt.option('staging') ?
                    [
                        ghpagesCommand(),
                        prompt('Resetting to the first commit...'),
                        'git reset $(git rev-list --max-parents=0 --abbrev-commit HEAD) --quiet',
                        prompt('Removing .gitignore...'),
                        'rm -f .gitignore',
                        'git add .gitignore',
                        prompt('Adding CNAME...'),
                        `echo '${global.release_config.staging.CNAME}' > CNAME`,
                        'git add CNAME',
                        'git commit -m "Add CNAME" --quiet',
                        prompt('Pushing to origin...'),
                        'git push origin gh-pages -f --quiet',
                        prompt('Cleaning up...'),
                        'git reset --hard origin/gh-pages --quiet'
                    ].join(' && ') :
                    prompt('Reset runs only on staging.', 'warn')
                ) :
                prompt('Reset did not run.'),
            options: {
                stdout: true
            }
        },
        remove_folder: {
            command: grunt.option('keep') && grunt.option('folder') ? (
                [
                    ghpagesCommand(),
                    prompt('Removing folders except the ones specified...'),
                    `find . -name "br_*" ! -name ${grunt.option('folder').split(',').join(' ! -name ')} | while read folder; do rm -rf "$folder"; done`,
                    prompt('Committing...'),
                    'git commit -a -m "Remove all but specified folders" --quiet',
                    prompt('Pushing to origin...'),
                    'git push origin gh-pages --quiet'
                ].join(' && ')
            ) : (
                grunt.option('folder') ?
                [
                    ghpagesCommand(),
                    prompt('Removing folders...'),
                    `rm -rf ${grunt.option('folder').split(',').join(' ')}`,
                    prompt('Committing...'),
                    'git commit -a -m "Remove folders" --quiet',
                    prompt('Pushing to origin...'),
                    'git push origin gh-pages --quiet'
                ].join(' && ') :
                prompt('Need to specify folders to remove: --folder=br_fix,br_beta,...', 'warn')
            ),
            options: {
                stdout: true
            }
        },
    }
};
