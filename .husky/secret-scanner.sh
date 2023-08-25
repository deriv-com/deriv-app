#!/bin/bash

#checking absolute paths
if command -v trufflehog &> /dev/null; then
    trufflehog_path="trufflehog"
elif [[ -x /usr/local/bin/trufflehog ]]; then
    trufflehog_path="/usr/local/bin/trufflehog"
elif [[ -x /opt/homebrew/bin/trufflehog ]]; then
    trufflehog_path="/opt/homebrew/bin/trufflehog"
else
    echo "Trufflehog is not setup. Please connect with Product Security Team"
    exit 1
fi

# Use `filesysytem` if the git repo does not have any commits i.e its a new git repo.
if git log -1 > /dev/null 2>&1; then
    $trufflehog_path git file://. --no-update --since-commit HEAD --fail > /tmp/trufflehog_output_$(whoami) 2>&1
    trufflehog_exit_code=$?
else
    $trufflehog_path filesystem . --no-update --fail > /tmp/trufflehog_output_$(whoami) 2>&1
    trufflehog_exit_code=$?
fi

# Only display results to stdout if trufflehog found something.
if [ $trufflehog_exit_code -eq 183 ]; then
    cat /tmp/trufflehog_output_$(whoami)
    echo "TruffleHog found secrets. Aborting commit. use --no-verify to bypass it"
    exit $trufflehog_exit_code
fi
