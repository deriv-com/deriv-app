#!/usr/bin/env node

/* eslint-disable no-console */
const BabelParser = require('@babel/parser');
const color       = require('cli-color');
const emphasize   = require('emphasize');
const estraverse  = require('estraverse');
const fs          = require('fs');
const Path        = require('path');
const common      = require('./common');

const config = {
    base_folder          : './src/javascript/',
    excluded_folders     : ['__tests__', '_common/lib'],
    supported_apps       : ['app', 'app_2'],
    localize_method_names: ['localize', 'localizeKeepPlaceholders'],
    ignore_comment       : 'localize-ignore', // put /* localize-ignore */ right after the first argument to ignore
    parser_options       : {
        sourceType: 'module',
        plugins   : [
            'classProperties',
            'decorators-legacy',
            'dynamicImport',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'jsx',
            'objectRestSpread',
        ],
    },
};
const methods_regex = new RegExp(`^(${config.localize_method_names.join('|')})$`);

const source_strings = {};
const ignored_list   = {};
const invalid_list   = {};

let this_app_name;

const parse = (app_name, is_silent) => {
    if (!config.supported_apps.includes(app_name)) {
        const error_msg = `The app name '${app_name}' is not supported. Supported apps are: ${config.supported_apps.join(', ')}`;
        throw new Error(error_msg);
    }

    if (!is_silent) {
        process.stdout.write(common.messageStart(`Extracting js texts (${app_name})`));
    }
    const start_time = Date.now();

    this_app_name = app_name;
    source_strings[this_app_name] = new Set();
    ignored_list[this_app_name]   = [];
    invalid_list[this_app_name]   = [];

    walker(Path.resolve(config.base_folder, '_common')); // common for all 'supported_apps'
    walker(Path.resolve(config.base_folder, app_name));
    if (app_name === 'app') {
        walker(Path.resolve(config.base_folder, 'static'));
    }

    if (!is_silent) {
        process.stdout.write(common.messageEnd(Date.now() - start_time));
        printSummary();
    }
};

const walker = (path) => {
    const list = fs.readdirSync(path);
    list.forEach((f) => {
        const this_path = Path.resolve(path, f);
        if (fs.statSync(this_path).isDirectory()) {
            if (!(new RegExp(config.excluded_folders.join('|')).test(this_path))) {
                walker(this_path);
            }
        } else if (/^[^.].*jsx?$/.test(f)) {
            parseFile(this_path);
        }
    });
};

const parseFile = (path_to_js_file) => {
    if (!path_to_js_file) {
        throw new Error('Missing js file path!');
    }

    const js_source  = fs.readFileSync(path_to_js_file).toString();

    const parsed = BabelParser.parse(js_source, { ...config.parser_options, sourceFilename: path_to_js_file });
    estraverse.traverse(parsed, {
        enter: (node) => {
            extractor(node, js_source);
        },
        fallback: 'iteration',
    });
};

const extractor = (node, js_source) => {
    const callee = node.callee || {};
    const is_function   = node.type   === 'CallExpression'   && methods_regex.test(callee.name);                  // localize('...')
    const is_expression = callee.type === 'MemberExpression' && methods_regex.test((callee.property || {}).name); // Localize.localize('...')

    if (is_function || is_expression) {
        const first_arg = node.arguments[0];

        if (first_arg.type === 'ArrayExpression') { // support for array of strings
            first_arg.elements.forEach(item => { processNode(item, js_source); });
        } else {
            processNode(first_arg, js_source);
        }
    }
};

const processNode = (node, js_source) => {
    if (node.type === 'StringLiteral') {
        source_strings[this_app_name].add(node.value);
    } else {
        const should_ignore = shouldIgnore(node);
        (should_ignore ? ignored_list : invalid_list)[this_app_name].push(node.loc);

        if (!should_ignore) {
            report(node, js_source);
        }
    }
};

const shouldIgnore = (arg) => {
    const comments = (arg.trailingComments || []).map(c => c.value).join(' ');
    return new RegExp(`\\b${config.ignore_comment}\\b`).test(comments);
};

// --------------------------
// ----- Error Reporter -----
// --------------------------
const gray = color.xterm(240);
const red  = color.bold.xterm(160);

const getLineNumber = (start_line, gutter_len, idx) => (
    gray(`${start_line + idx + 1}${' '.repeat(gutter_len - 3 - (start_line + idx + 1).toString().length)} | `)
);

const report = (node, js_source) => {
    const padding       = ' '.repeat(3);
    const start_line    = node.loc.start.line;
    const start_column  = node.loc.start.column;
    const file_name     = node.loc.filename.split(config.base_folder.substr(1))[1];
    const formatted_loc = gray(`:${start_line}:${start_column}`);

    const code_start_line = start_line - 3;
    const code_end_line   = node.loc.end.line;
    const code_gutter_len = code_end_line.toString().length + 3;

    console.log(red('\n\n>>'), color.underline(`${config.base_folder}${file_name}${formatted_loc}`));
    console.log(red(`${padding}Expected string literal but found:`), color.yellow(js_source.substring(node.start, node.end)));
    console.log(
        js_source
            .toString()
            .split('\n')
            .slice(code_start_line, code_end_line)
            .map((line, idx) => `${padding}${getLineNumber(code_start_line, code_gutter_len, idx)}${emphasize.highlight('js', line).value}`)
            .join('\n')
    );
    console.log(`${padding}${' '.repeat(start_column + code_gutter_len)}${color.bold.yellow('^')}`);
};

const printSummary = () => {
    console.log(
        color.cyanBright(`\n Summary: (${this_app_name})\n`),
        color.yellowBright(`${'='.repeat(16)}\n`),
        `${color.green('strings:')}${formatValue(source_strings[this_app_name].size)}`,
        `${'ignored:'}${formatValue(ignored_list[this_app_name].length)}`,
        `${color.red('invalid:')}${formatValue(invalid_list[this_app_name].length)}`,
    );
};

const formatValue = (value) => (
    `${color.whiteBright(value.toLocaleString().padStart(8))}\n`
);

exports.parse          = parse;
exports.getTexts       = (app_name = this_app_name) => source_strings[app_name];
exports.getErrorsCount = (app_name = this_app_name) => invalid_list[app_name].length;
