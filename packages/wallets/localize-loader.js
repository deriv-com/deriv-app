import crypto from 'crypto';
import fs from 'fs';

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

async function generateKey(inputString) {
    // Convert the string to an array buffer
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Calculate the SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    // Take a substring to get a shorter key (adjust the length as needed)
    // NOTE: If there is hash collision, increase the substring length
    const shortKey = hashHex.substring(0, 8);

    return shortKey;
}

const messages = new Map();
const values = new Set();

module.exports = async function (source) {
    let shouldGen = false;
    const ast = parser.parse(source, {
        plugins: ['jsx', 'typescript'],
        sourceType: 'module',
    });

    traverse(ast, {
        CallExpression(path) {
            if (
                (path.node.callee.name && path.node.callee.name === 't') ||
                (path.node.callee.property &&
                    path.node.callee.property.name === 't' &&
                    !values.has(path.node.arguments[0].value))
            ) {
                shouldGen = true;
                const value = path.node.arguments[0].value;
                values.add(value);
                generateKey(path.node.arguments[0].value).then(key => {
                    path.node.arguments[0] = {
                        type: 'StringLiteral',
                        value: key,
                    };
                    messages.set(key, value);
                });
            }
        },
        JSXIdentifier(path) {
            const value = path.parent?.attributes?.find(attr => attr.name?.name === 'defaults')?.value?.value;
            if (path.node.name === 'Trans' && !values.has(value)) {
                values.add(value);
                shouldGen = true;
                generateKey(value).then(key => {
                    messages.set(key, value);
                });
            }
        },
    });

    if (shouldGen) {
        fs.writeFileSync('./src/translations/messages.json', JSON.stringify(Object.fromEntries(messages)));
        return generate(ast).code;
    }

    return source;
};
