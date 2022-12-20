#!/bin/bash

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
            if [[ $file =~ packages/$package ]]; then
                MODIFIED_PACKAGES+=($package)
            fi
        done
    done

    echo ${MODIFIED_PACKAGES[@]}
}

function isStyleModified() {
    MODIFIED_FILES=$(getModifiedFiles)
    for file in ${MODIFIED_FILES[@]};
    do
        if [[ $file =~ \.css|s(c|a)ss ]] && [[ $file =~ packages/$1 ]]; then
            return 0
        fi
    done

    return 1
}

function isJavascriptModified() {
    MODIFIED_FILES=$(getModifiedFiles)
    for file in ${MODIFIED_FILES[@]};
    do
        if [[ $file =~ \.js|jsx ]] && [[ $file =~ packages/$1 ]]; then
            return 0
        fi
    done

    return 1
}

function main() {
    MODIFIED_PACKAGES=$(getModifiedPackages)
    for package in ${MODIFIED_PACKAGES[@]};
    do
        if isJavascriptModified $package; then
            npm run test:eslint $package
        fi

        if isStyleModified $package; then
            npm run test:stylelint $package
        fi

        npm run test:jest $package
    done
}

main