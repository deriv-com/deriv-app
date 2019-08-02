#!/bin/sh

SHOULD_RUN_STYLELINT=false
SHOULD_RUN_ESLINT=false
MODIFIED_PACKAGES=()

files=`git diff --name-only`
for file in $files;
do
    # Checks if we should run eslint or stylelint.
    if [[ $file =~ \.css|s(c|a)ss ]]; then
        SHOULD_RUN_STYLELINT=true
    fi
    if [[ $file =~ \.js|jsx ]]; then
        SHOULD_RUN_ESLINT=true
    fi

    # Get which project we should run the linters for.
    package_to_test=('trader' 'bot')
    for package in ${package_to_test[@]};
    do
        if [[ $package =~ ${package} ]]; then
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