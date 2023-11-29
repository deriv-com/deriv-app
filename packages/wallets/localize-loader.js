/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import fs from 'fs';

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function generateKey(value) {
    return value
        ?.split(' ')
        .map(c => c.charAt(0))
        .join('');
}

const messages = new Map();
const values = new Set();
let counter = 0;

module.exports = async function (source) {
    let should_gen = false;
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
                const value = path.node.arguments[0].value;
                values.add(value);
                should_gen = true;
                let key = generateKey(path.node.arguments[0].value);
                if (messages.has(key)) {
                    key += `-${counter}`;
                    counter += 1;
                }
                path.node.arguments[0] = {
                    type: 'StringLiteral',
                    value: key,
                };
                messages.set(key, value);
            }
        },
    });

    if (should_gen) {
        fs.writeFileSync('./src/translations/messages.json', JSON.stringify(Object.fromEntries(messages)));
        return generate(ast).code;
    }

    return source;
};
