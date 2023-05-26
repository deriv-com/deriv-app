#!/bin/bash

# This script checks that every file in the src directory has a corresponding test file in the __tests__ directory.
# It is used in the pre-commit hook to ensure that every file is tested before a commit is made.

# Usage: ./scripts/check-tests.sh <src-directory>
# Example: ./scripts/check-tests.sh packages/hooks/src

SRC_DIR=$1
TESTS_DIR="$SRC_DIR/__tests__"

# Finds all files in the src directory that are not index files.
SRC_FILES=$(ls $SRC_DIR | grep -E "\.js|\.jsx|\.ts|\.tsx" | grep -v "index")

# Finds all test files in the __tests__ directory.
TEST_FILES=$(ls $TESTS_DIR | grep -E "\.test\.js|\.test\.jsx|\.test\.ts|\.test\.tsx|\.spec\.js|\.spec\.jsx|\.spec\.ts|\.spec\.tsx")

ERRORS=0

# Checks that every file in the src directory has a corresponding test file. If not, it prints an error message.
for file in $SRC_FILES
    do
        if [[ ! "$TEST_FILES" =~ "${file%.*}" ]]; then
            # If the file is not in the list of test files, print an error message.
            echo "No test file found for: $SRC_DIR/$file"

            # Increment the error count.
            ERRORS=$((ERRORS+1))
        fi
    done

# If there are any errors, exit with a non-zero exit code.
if [[ $ERRORS -gt 0 ]]; then
    echo "Found $ERRORS files without a corresponding test file"
    exit 1
fi
