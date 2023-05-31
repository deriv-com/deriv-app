const path = require('path');
const fs = require('fs');

class BlocklyConcatPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            const { outputPath, fileName, filesToConcat } = this.options;

            // Read the content of each file
            const fileContents = filesToConcat.map(filePath => {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                return `// File: ${path.basename(filePath)}\n${fileContent}\n`;
            });

            // Concatenate the file contents
            const mergedContent = fileContents.join('\n');

            // Create the output file
            const outputFile = path.join(outputPath, fileName);
            compilation.assets[outputFile] = {
                source: () => mergedContent,
                size: () => Buffer.byteLength(mergedContent),
            };

            callback();
        });
    }
}

module.exports = BlocklyConcatPlugin;
