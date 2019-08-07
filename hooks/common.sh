#!/bin/sh

function getModifiedFiles() {
    branch=`git branch | grep \* | cut -d ' ' -f2`
    MODIFIED_FILES=`git diff origin/$branch --name-only`
    echo ${MODIFIED_FILES[@]}
}

function getModifiedPackages() {
    MODIFIED_PACKAGES=()
    MODIFIED_FILES=$(getModifiedFiles)
    for file in ${MODIFIED_FILES[@]};
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