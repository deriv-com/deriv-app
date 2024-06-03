const fs = require('fs');
const path = require('path');

const RED_THRESHOLD = 5;

const packagesDir = './packages';
const oldPackagesDir = './old/packages';
const packages = [...new Set([...fs.readdirSync(packagesDir), ...fs.readdirSync(oldPackagesDir)])];

let tableRows = '';

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

    let formattedPercentage = formatPercentageWithSign(diff);

    let lightSign = '';
    if (percentage <= 0) {
        lightSign = '🟢';
    } else if (percentage > 0 && percentage <= 5) {
        lightSign = '🟡';
    } else {
        lightSign = '🔴';
    }

    tableRows += `
    <tr>
      <td>${pkg}</td>
      <td>${formatBytes(oldSize)}</td>
      <td>${formatBytes(newSize)}</td>
      <td>${formatBytes(newSize - oldSize, true)}</td>
      <td>${formattedPercentage}</td>
    </tr>
  `.trim();
}

console.log(
    `
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
</table>
`.trim()
);

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
    if (input === null || isNaN(input)) {
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
