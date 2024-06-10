const fs = require('fs');
const path = require('path');

// read and use parameters from command line
const args = process.argv.slice(2); // Skip the first two elements
let format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'html';
let orangeThreshold = +(args.find(arg => arg.startsWith('--orangeThreshold='))?.split('=')[1] || 0.5);
let redThreshold = +(args.find(arg => arg.startsWith('--redThreshold='))?.split('=')[1] || 5);

// main function execution
main();

function main() {
    // format: [package]: { oldSize, newSize, diff, percentage }
    const sizes = analyse();

    // format to different output based on the format parameter
    // nice table in html if its for comment, nice table in console if its for console, or just true/false if its just to check validity
    if (format === 'html') {
        let formattedOutput = formatToTable(sizes);
        console.log(formattedOutput);
    } else if (format === 'console') {
        let formattedOutput = formatToConsole(sizes);
        console.table(formattedOutput, ['oldSize', 'newSize', 'diff', 'percentage', 'alert']);
    } else if (format === 'boolean') {
        const aboveRedThreshold = Object.values(sizes).some(pkg => pkg.percentage > redThreshold);
        if (aboveRedThreshold) {
            console.log('true');
        } else {
            console.log('false');
        }
    }
}

function analyse() {
    const packagesDir = './packages';
    const oldPackagesDir = './old/packages';

    const packages = [...new Set([...fs.readdirSync(packagesDir), ...fs.readdirSync(oldPackagesDir)])];

    const result = {};

    for (const pkg of packages) {
        const oldReport = readJsonFile(path.join(oldPackagesDir, pkg, 'report.json'));
        const newReport = readJsonFile(path.join(packagesDir, pkg, 'report.json'));

        if (!newReport) {
            continue;
        }

        const oldSize = oldReport ? oldReport.reduce((acc, item) => acc + item.gzipSize, 0) : null;
        const newSize = newReport ? newReport.reduce((acc, item) => acc + item.gzipSize, 0) : null;

        let diff = oldSize && newSize ? newSize - oldSize : oldSize || newSize;
        let percentage = oldSize && newSize ? calculatePercentage(oldSize, newSize) : null;

        result[pkg] = {
            oldSize,
            newSize,
            diff,
            percentage,
        };
    }

    return result;
}

function formatToTable(sizes) {
    const GREEN_SIGN = '🟢';
    const YELLOW_SIGN = '🟡';
    const RED_SIGN = '🔴';

    let tableRows = '';
    for (const [pkg, { oldSize, newSize, diff, percentage }] of Object.entries(sizes)) {
        const formattedPercentage = formatPercentageWithSign(percentage);
        const lightSign =
            percentage > redThreshold ? RED_SIGN : percentage > orangeThreshold ? YELLOW_SIGN : GREEN_SIGN;

        tableRows += `
        <tr>
          <td>${pkg}</td>
          <td>${formatBytes(oldSize)}</td>
          <td>${formatBytes(newSize)}</td>
          <td>${formatBytes(diff, true)}</td>
          <td>${formattedPercentage} ${lightSign}</td>
        </tr>
      `.trim();
    }

    return `
    <table>
        <thead>
            <th>package</th>
            <th>old</th>
            <th>new</th>
            <th>diff</th>
            <th>pct change</th>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>`
        .replace(/[\n\t]/g, '')
        .trim();
}

function formatToConsole(sizes) {
    Object.keys(sizes).forEach(key => {
        const pkg = sizes[key];
        pkg.oldSize = formatBytes(pkg.oldSize);
        pkg.newSize = formatBytes(pkg.newSize);
        pkg.diff = formatBytes(pkg.diff, true);
        pkg.alert = pkg.percentage > redThreshold ? 'FAIL' : pkg.percentage > orangeThreshold ? 'WARN' : 'OK';
        pkg.percentage = formatPercentageWithSign(pkg.percentage);
    });
    return sizes;
}

function readJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}

function calculatePercentage(oldSize, newSize) {
    return ((newSize - oldSize) / oldSize) * 100;
}

function formatBytes(bytes, sign = false) {
    if (bytes === null || isNaN(bytes)) {
        return 'n/a';
    }

    let formattedValue = '';

    if (bytes < 1024) {
        formattedValue = bytes + ' B'; // Bytes
    } else if (bytes < 1048576) {
        formattedValue = Math.round(bytes / 1024) + ' KB'; // Kilobytes
    } else {
        formattedValue = (bytes / 1048576).toFixed(1) + ' MB'; // Megabytes
    }

    if (sign) {
        if (bytes === 0) {
            return '0 B';
        }
        formattedValue = bytes >= 0 ? '+' + formattedValue : '-' + formattedValue;
    }

    return formattedValue;
}

function formatPercentageWithSign(percentage) {
    if (percentage === null || isNaN(percentage)) {
        return 'n/a';
    }

    const absPercentage = Math.abs(percentage);
    const decimalPoints = absPercentage < 10 ? 1 : 2;
    let formattedValue = percentage.toFixed(decimalPoints) + '%';

    if (percentage === 0) {
        return '0%';
    }

    return percentage >= 0 ? '+' + formattedValue : '−' + formattedValue;
}
