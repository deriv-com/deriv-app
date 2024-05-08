#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Array of project directories
declare -a projects=(
  "packages/api"
  "packages/api-v2"
  "packages/hooks"
  "packages/utils"
  "packages/stores"
  "packages/wallets"
  "packages/tradershub"
  "packages/account-v2"
  "packages/cashier-v2"
)

# Loop through the array, running TypeScript checks
for project in "${projects[@]}"; do
  echo "Checking TypeScript in ${project}..."
  npx tsc --project "${project}/tsconfig.json" -noEmit
done

echo "All TypeScript checks completed successfully."
