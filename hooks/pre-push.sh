#!/bin/sh

. $(dirname $0)/common.sh

MODIFIED_PACKAGES=$(getModifiedPackages)
for package in ${MODIFIED_PACKAGES[@]};
do
    npm run test:mocha $package
done