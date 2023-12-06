import fs from 'fs';
import { sha256 as SHA256 } from 'sha.js';

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function generateKey(inputString) {
    // Convert the string to an array buffer
    const key = new SHA256().update(inputString).digest('hex');

    // NOTE: If there are key collisions, increase the substring length
    return key.substring(0, 8);
}

let messages;
if (fs.existsSync('./src/translations/messages.json')) {
    const initialMessages = JSON.parse(fs.readFileSync('./src/translations/messages.json', 'utf-8'));
    messages = new Map(initialMessages);
} else {
    messages = new Map();
}
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
                if (value) {
                    values.add(value);
                    const key = generateKey(path.node.arguments[0].value);
                    path.node.arguments[0] = {
                        type: 'StringLiteral',
                        value: key,
                    };
                    messages.set(key, value);
                }
            }
        },
        JSXIdentifier(path) {
            const value = path.parent?.attributes?.find(attr => attr.name?.name === 'defaults')?.value?.value;
            if (value && path.node.name === 'Trans' && !values.has(value)) {
                values.add(value);
                shouldGen = true;
                const key = generateKey(value);
                messages.set(key, value);
            }
        },
    });

    if (shouldGen) {
        fs.writeFileSync('./src/translations/messages.json', JSON.stringify(Object.fromEntries(messages)));
        return generate(ast).code;
    }

    return source;
};
