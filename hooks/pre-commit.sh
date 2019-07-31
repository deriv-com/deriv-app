#!/bin/sh

# To do
# 1. run based on project

for file in `git diff --name-only`:
do
    if [[ $file =~ \.sh|s(c|a)ss ]]; then
        npm run test:stylelint
    fi

    if [[ $file =~ \.js|jsx ]]; then
        npm run test:eslint
    fi
done