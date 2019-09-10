npx lerna bootstrap --since $CURRENT_BRANCH
npx lerna run build:travis \
    --scope deriv-shared \
    --scope deriv-components \
    --since dev