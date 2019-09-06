CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`

# Check if package json or package lock is changed.
npm ci
npx lerna bootstrap --since $CURRENT_BRANCH
npx lerna run build:travis \
    --scope deriv-shared \
    --scope deriv-components \
    --since $CURRENT_BRANCH