#!/bin/sh

function isStyleModified() {
    if [[ `git diff --name-only` =~ \.css|s(c|a)ss ]]; then
        return 0
    fi

    return 1
}

function isJavascriptModified() {
    if [[ `git diff --name-only` =~ \.js|jsx ]]; then
        return 0
    fi

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
        if isJavascriptModified && [[ `git diff --name-only` =~ $package ]]; then
            npm run test:eslint $package
        fi

        if isStyleModified && [[ `git diff --name-only` =~ $package ]]; then
            npm run test:stylelint $package
        fi
    done
}

main