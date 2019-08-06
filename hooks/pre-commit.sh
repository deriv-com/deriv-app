#!/bin/sh

function isStyleModified() {
    for file in `git diff --name-only`;
    do
        if [[ $file =~ \.css|s(c|a)ss ]] && [[ $file =~ $1 ]]; then
            return 0
        fi
    done

    return 1
}

function isJavascriptModified() {
    for file in `git diff --name-only`;
    do
        if [[ $file =~ \.js|jsx ]] && [[ $file =~ $1 ]]; then
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

    echo ${MODIFIED_PACKAGES[@]}
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
    done
}

main