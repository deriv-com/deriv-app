/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import fs from 'fs';
import glob from 'glob';
import generate from '@babel/generator';
import parser from '@babel/parser';
import traverse from '@babel/traverse';

const targetFile = fs.readFileSync('./packages/wallets/scripts/text-to-localize.txt', 'utf-8');

const target = new Set(targetFile.split('\n'));

function generateCallExpr(text) {
    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: {
                type: 'Identifier',
                name: 'i18n',
            },
            property: {
                type: 'Identifier',
                name: 't',
            },
        },
        arguments: [
            {
                type: 'StringLiteral',
                value: text,
            },
        ],
    };
}

function generateJSXExpr(text) {
    return {
        type: 'JSXExpressionContainer',
        expression: generateCallExpr(text),
    };
}

function generateImportExpr() {
    return {
        type: 'ImportDeclaration',
        specifiers: [
            {
                type: 'ImportDefaultSpecifier',
                local: {
                    type: 'Identifier',
                    name: 'i18n',
                },
            },
        ],
        source: {
            type: 'StringLiteral',
            value: 'Translations',
        },
    };
}

const getLocalizableFiles = () => {
    const globs = ['wallets/**/*.tsx'];
    const file_paths = [];

    for (let j = 0; j < globs.length; j++) {
        let files_found = glob.sync(`./packages/${globs[j]}`);
        files_found = files_found.filter(file_path => file_path.indexOf('__tests__') === -1);
        file_paths.push(...files_found);
    }

    return file_paths;
};

const main = async () => {
    const files = getLocalizableFiles();

    for (let i = 0; i < files.length; i++) {
        const source = fs.readFileSync(files[i], 'utf-8');

        const ast = parser.parse(source, {
            plugins: ['jsx', 'typescript'],
            sourceType: 'module',
        });

        let shouldGen = false;

        traverse(ast, {
            JSXAttribute(path) {
                if (path.node.value && target.has(path.node.value.value)) {
                    path.node.value = generateJSXExpr(path.node.value.value);
                    shouldGen = true;
                }
            },
            ObjectProperty(path) {
                if (path.node.value && target.has(path.node.value.value)) {
                    path.node.value = generateCallExpr(path.node.value.value);
                    shouldGen = true;
                }
            },
        });

        if (shouldGen) {
            traverse(ast, {
                Program(path) {
                    path.node.body = [generateImportExpr(), ...path.node.body];
                },
            });
            const output = generate(ast, {
                retainLines: true,
            }).code;
            fs.writeFileSync(files[i], output);
        }
    }
};

await main();
