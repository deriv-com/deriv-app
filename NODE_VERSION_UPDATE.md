# Node.js Version Update

This PR updates the Node.js version requirement from 18.x (deprecated) to 20.x across the entire codebase:

## Changes Made:

1. Updated the Node.js engine requirement in root package.json from 18.x to 20.x
2. Updated the Node.js engine requirement in all subpackage package.json files from 18.x to 20.x
3. Updated the GitHub Action setup-node step to use Node.js 20.x
4. Updated the badge in README.md to show Node.js 20.x and npm 10.x requirements

## Note about Dependencies:

Some dependencies like @deriv-com/analytics still require Node.js 18.x and npm 9.x. These dependencies will need to be updated separately or overridden as needed. The application should still work with Node.js 20.x, but there may be warnings about unsupported engines.

## Testing:

- The application has been tested to build and run with Node.js 20.x
- CI/CD pipelines have been updated to use Node.js 20.x

This update addresses the deprecation warning for Node.js 18.x and ensures the application is using a currently supported LTS version of Node.js.
