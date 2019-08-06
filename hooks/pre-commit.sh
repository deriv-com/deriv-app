#!/bin/sh

function isStyleModified() {
    for file in `git diff --name-only`; do
        if [[ $file =~ \.css|s(c|a)ss ]]; then
            return 0
        fi
    done
    return 1
}

function isJavascriptModified() {
    for file in `git diff --name-only`; do
        if [[ $file =~ \.js|jsx ]]; then
            return 0
        fi
    done
    return 1
}

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

    echo $MODIFIED_PACKAGES
}

function main() {
    modified_packages=$(getModifiedPackages)
    for package in ${modified_packages[@]};
    do
        if isJavascriptModified; then
            npm run test:eslint $package
        fi

        if isStyleModified; then
            npm run test:stylelint $package
        fi
    done
}

main