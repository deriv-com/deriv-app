#!/bin/bash

# Script to update Node.js version from 18.x to 20.x in all package.json files

# Find all package.json files in the packages directory
find ./packages -name "package.json" -type f | while read -r file; do
  echo "Processing $file"
  # Use sed to replace "node": "18.x" with "node": "20.x"
  sed -i '' 's/"node": "18.x"/"node": "20.x"/g' "$file"
done

echo "Node.js version update completed!"
