#!/bin/bash

echo "Running TypeScript checks..."

declare -a ts_projects=(
  "packages/api/tsconfig.json"
  "packages/api-v2/tsconfig.json"
  "packages/hooks/tsconfig.json"
  "packages/utils/tsconfig.json"
  "packages/stores/tsconfig.json"
  "packages/wallets/tsconfig.json"
  "packages/cashier-v2/tsconfig.json"
)

for ts_project in "${ts_projects[@]}"; do
  echo "Checking TypeScript for $ts_project"
  npx tsc --project "$ts_project" --noEmit
  if [ $? -ne 0 ]; then
    echo "TypeScript check failed for $ts_project"
    exit 1
  fi
done

echo "Running ESLint checks..."

declare -a eslint_packages=(
  "packages/wallets"
  "packages/cashier-v2"
)

for eslint_package in "${eslint_packages[@]}"; do
  echo "Checking ESLint for $eslint_package"
  npx eslint --fix --ignore-path "$eslint_package/.eslintignore" --config "$eslint_package/.eslintrc.js" "$eslint_package"
  if [ $? -ne 0 ]; then
    echo "ESLint check failed for $eslint_package"
    exit 1
  fi
done

echo "Running Stylelint checks..."

declare -a stylelint_paths=(
  "packages/wallets/**/*.scss"
  "packages/cashier-v2/**/*.scss"
)

for stylelint_path in "${stylelint_paths[@]}"; do
  echo "Checking Stylelint for $stylelint_path"
  npx stylelint "$stylelint_path"
  if [ $? -ne 0 ]; then
    echo "Stylelint check failed for $stylelint_path"
    exit 1
  fi
done

echo "Running tests..."

declare -a test_packages=(
  "packages/hooks/src"
  "packages/utils/src"
)

for test_package in "${test_packages[@]}"; do
  echo "Checking tests for $test_package"
  bash ./scripts/check-tests.sh "$test_package"
  if [ $? -ne 0 ]; then
    echo "Test check failed for $test_package"
    exit 1
  fi
done

echo "Running CI tests..."
npm run test:ci

if [ $? -ne 0 ]; then
  echo "CI tests failed"
  exit 1
fi

echo "All checks passed successfully."
