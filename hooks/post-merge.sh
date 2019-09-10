CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`

npx lerna bootstrap --since $CURRENT_BRANCH
npx lerna run build:travis \
    --scope deriv-shared \
    --scope deriv-components \
    --since $CURRENT_BRANCH