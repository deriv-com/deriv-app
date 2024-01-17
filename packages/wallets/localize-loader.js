import fs from 'fs';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generateKey from './src/utils/generate-keys';

const messages = new Map();
const values = new Set();
let defaultMessages;

try {
    if (fs.existsSync('./src/translations/en.json')) {
        const entries = Object.entries(JSON.parse(fs.readFileSync('./src/translations/en.json', 'utf-8')));
        defaultMessages = new Map(entries);
    } else {
        defaultMessages = new Map();
    }
} catch (err) {
    defaultMessages = new Map();
}

module.exports = async function (source) {
    const ast = parse(source, {
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
                if (value) {
                    values.add(value);
                    const key = generateKey(path.node.arguments[0].value);
                    if (messages.has(key) && messages.get(key) !== value)
                        throw new Error(
                            `Error while generating keys for translations: Key collision detected for strings ${messages.get(
                                key
                            )} and ${value}.`
                        );

                    // This ensures that if no translations have been translated for the strings yet, don't transpile the strings into keys
                    // otherwise, i18n will display the keys instead of the strings
                    // only transpile when translations for the strings are available
                    if (defaultMessages.has(key)) {
                        path.node.arguments[0] = {
                            type: 'StringLiteral',
                            value: key,
                        };
                    }
                    messages.set(key, value);
                }
            }
        },
        JSXIdentifier(path) {
            const value = path.parent?.attributes?.find(attr => attr.name?.name === 'defaults')?.value?.value;
            if (value && path.node.name === 'Trans' && !values.has(value)) {
                values.add(value);
                const key = generateKey(value);
                if (messages.has(key) && messages.get(key) !== value)
                    throw new Error(
                        `Error while generating keys for translations: Key collision detected for strings ${messages.get(
                            key
                        )} and ${value}.`
                    );
                messages.set(key, value);
            }
        },
    });

    if (messages.size > 0) {
        fs.writeFileSync('./src/translations/messages.json', JSON.stringify(Object.fromEntries(messages)));
        return generate(ast).code;
    }

    return source;
};
