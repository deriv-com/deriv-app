#!/bin/sh

function getModifiedPackages() {
    MODIFIED_PACKAGES=()
    for file in `git diff --name-only`;
    do
        PACKAGE_TO_TEST=('trader' 'bot')
        for package in ${PACKAGE_TO_TEST[@]};
        do
            if [[ $file =~ ${package} ]]; then
                MODIFIED_PACKAGES+=($package)
            fi
        done
    done

    echo ${MODIFIED_PACKAGES[@]}
}

MODIFIED_PACKAGES=$(getModifiedPackages)
for package in ${MODIFIED_PACKAGES[@]};
do
    npm run test:mocha $package
done