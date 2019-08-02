#!/bin/sh

## Main Routine
SHOULD_RUN_STYLELINT=false
SHOULD_RUN_ESLINT=false
MODIFIED_PACKAGES=()

# Checks if we should run eslint or stylelint.
files=`git diff --name-only`
for file in $files;
do
    # checks for stylelint
    if [[ $file =~ \.css|s(c|a)ss ]]; then
        SHOULD_RUN_STYLELINT=true
    fi

    # checks for eslint
    if [[ $file =~ \.js|jsx ]]; then
        SHOULD_RUN_ESLINT=true
    fi

    # get which packages are affected
    package_to_test=('trader' 'bot')
    for package in ${package_to_test[@]};
    do
        if [[ $package =~ ${package} ]]; then
            echo $package
            MODIFIED_PACKAGES+=($package)
        fi
    done
done

# Run linters based on packages
for package in ${MODIFIED_PACKAGES[@]};
do
    if [ $SHOULD_RUN_STYLELINT = true ]; then
        npm run test:stylelint $package
    fi
    if [ $SHOULD_RUN_ESLINT = true ]; then
        npm run test:eslint $package
    fi
done