#!/bin/sh

. $(dirname $0)/common.sh

function isStyleModified() {
    MODIFIED_FILES=$(getModifiedFiles)
    for file in ${MODIFIED_FILES[@]};
    do
        if [[ $file =~ \.css|s(c|a)ss ]] && [[ $file =~ $1 ]]; then
            return 0
        fi
    done

    return 1
}

function isJavascriptModified() {
    MODIFIED_FILES=$(getModifiedFiles)
    for file in ${MODIFIED_FILES[@]};
    do
        if [[ $file =~ \.js|jsx ]] && [[ $file =~ $1 ]]; then
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
    done
}

main