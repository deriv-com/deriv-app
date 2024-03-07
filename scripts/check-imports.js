/**
 * This script checks if any of the packages contain prohibited imports.
 * Thats to avoid classic monorepo import-spaghetti.
 *
 * Context: not all packages have eslint running, running it globally tends to be slow and problematic.
 * So added this tiny script to just go over packages and check if they contain any prohibited imports.
 * Feel free to change it to eslint or smth better.
 */
const fs = require('fs');
const path = require('path');

const BLOCKED_IMPORTS = {
    '/packages/account': ['@deriv/api-v2'],
    '/packages/api': ['@deriv/api-v2'],
    '/packages/appstore': ['@deriv/api-v2'],
    '/packages/bot-skeleton': ['@deriv/api-v2'],
    '/packages/bot-web-ui': ['@deriv/api-v2'],
    '/packages/cashier': ['@deriv/api-v2'],
    '/packages/cfd': ['@deriv/api-v2'],
    '/packages/components': ['@deriv/api-v2'],
    '/packages/core': ['@deriv/api-v2'],
    '/packages/hooks': ['@deriv/api-v2'],
    '/packages/indicators': ['@deriv/api-v2'],
    '/packages/integration': ['@deriv/api-v2'],
    '/packages/p2p': ['@deriv/api-v2'],
    '/packages/publisher': ['@deriv/api-v2'],
    '/packages/reports': ['@deriv/api-v2'],
    '/packages/shared': ['@deriv/api-v2'],
    '/packages/stores': ['@deriv/api-v2'],
    '/packages/trader': ['@deriv/api-v2'],
    '/packages/translations': ['@deriv/api-v2'],
    '/packages/utils': ['@deriv/api-v2'],
};

// eslint-disable-next-line no-console
console.log('Validating imports...');

// go over each package and check if it contains any prohibited imports
Object.entries(BLOCKED_IMPORTS).forEach(([packagePath, blockedPackages]) => {
    const packageJsonPath = path.join(process.cwd(), packagePath, 'package.json');

    // check if package.json exists
    if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');

        blockedPackages.forEach(packageName => {
            if (packageJsonContent.includes(packageName)) {
                // eslint-disable-next-line no-console
                console.error(`Using of "${packageName}" in ${packagePath}/package.json is NOT ALLOWED!`);
                process.exit(1);
            }
        });
    } else {
        // eslint-disable-next-line no-console
        console.warn(`Warning: package.json not found at ${packagePath}. Skipping.`);
    }
});
