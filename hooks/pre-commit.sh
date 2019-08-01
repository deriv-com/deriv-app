#!/bin/sh

RUN_STYLELINT=false
RUN_ESLINT=false

for file_name in `git diff --name-only`:
do
    if [[ $file_name =~ \.css|s(c|a)ss ]]; then
        RUN_STYLELINT=true
    fi

    if [[ $file_name =~ \.js|jsx ]]; then
        RUN_ESLINT=true
    fi
done

for file_name in `git diff --name-only`:
do
    echo | grep -P (?<=packages\/)(\w+) << $file_name
done
