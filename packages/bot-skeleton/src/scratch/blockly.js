/* eslint import/no-webpack-loader-syntax: 0 */
const {
    goog,
    Blockly,
} = require('imports-loader?this=>window!exports-loader?goog&Blockly!scratch-blocks/blockly_compressed_vertical');

Blockly.JavaScript = require('blockly/javascript');

window.goog = goog;
window.Blockly = Blockly;

require('imports-loader!scratch-blocks/msg/messages');
require('./blocks');
require('./hooks');

Blockly.JavaScript.quote_ = text => {
    return `'${text.replace(/\\/g, '\\\\').replace(/\n/g, '\\\n').replace(/'/g, "\\'")}'`;
};
Blockly.JavaScript.init = function (t) {
    Blockly.JavaScript.definitions_ = Object.create(null),
        Blockly.JavaScript.functionNames_ = Object.create(null),
        Blockly.JavaScript.variableDB_ ? Blockly.JavaScript.variableDB_.reset() : Blockly.JavaScript.variableDB_ = new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_),
        Blockly.JavaScript.variableDB_.setVariableMap(t.getVariableMap());
    for (var o = [], n = Blockly.Variables.allDeveloperVariables(t), r = 0; r < n.length; r++)
        o.push(Blockly.JavaScript.variableDB_.getName(n[r], Blockly.Names.DEVELOPER_VARIABLE_TYPE));
    for (t = Blockly.Variables.allUsedVarModels(t),
        r = 0; r < t.length; r++)
        o.push(Blockly.JavaScript.variableDB_.getName(t[r].getId(), Blockly.Variables.NAME_TYPE));
    o.length && (Blockly.JavaScript.definitions_.variables = "var " + o.join(", ") + ";")
}

Blockly.JavaScript.valueToCode = function (e, t, o) {
    isNaN(o) && goog.asserts.fail('Expecting valid order from block "%s".', e.type);
    var n = e.getInputTargetBlock(t);
    if (!n)
        return "";
    if ("" === (t = this.blockToCode(n)))
        return "";
    if (goog.asserts.assertArray(t, 'Expecting tuple from value block "%s".', n.type),
        e = t[0],
        t = t[1],
        isNaN(t) && goog.asserts.fail('Expecting valid order from value block "%s".', n.type),
        !e)
        return "";
    n = !1;
    var r = Math.floor(o)
        , i = Math.floor(t);
    if (r <= i && (r != i || 0 != r && 99 != r))
        for (n = !0,
            r = 0; r < this.ORDER_OVERRIDES.length; r++)
            if (this.ORDER_OVERRIDES[r][0] == o && this.ORDER_OVERRIDES[r][1] == t) {
                n = !1;
                break
            }
    return n && (e = "(" + e + ")"),
        e
}

Blockly.JavaScript.blockToCode = function (e, t) {
    if (!e)
        return "";
    if (!e.isEnabled())
        return t ? "" : this.blockToCode(e.getNextBlock());
    var o = this[e.type];
    if ("function" != typeof o)
        throw Error('Language "' + this.name_ + '" does not know how to generate  code for block type "' + e.type + '".');
    if (o = o.call(e, e),
        Array.isArray(o)) {
        if (!e.outputConnection)
            throw TypeError("Expecting string from statement block: " + e.type);
        return [this.scrub_(e, o[0], t), o[1]]
    }
    if ("string" == typeof o)
        return this.STATEMENT_PREFIX && !e.suppressPrefixSuffix && (o = this.injectId(this.STATEMENT_PREFIX, e) + o),
            this.STATEMENT_SUFFIX && !e.suppressPrefixSuffix && (o += this.injectId(this.STATEMENT_SUFFIX, e)),
            this.scrub_(e, o, t);
    if (null === o)
        return "";
    throw SyntaxError("Invalid code generated: " + o)
}

Blockly.JavaScript.scrub_ = function (t, o, n) {
    var r = "";
    if (!t.outputConnection || !t.outputConnection.targetConnection) {
        var i = t.getCommentText();
        i && (i = Blockly.utils.string.wrap(i, Blockly.JavaScript.COMMENT_WRAP - 3),
            r += Blockly.JavaScript.prefixLines(i + "\n", "// "));
        for (var s = 0; s < t.inputList.length; s++)
            t.inputList[s].type == Blockly.INPUT_VALUE && (i = t.inputList[s].connection.targetBlock()) && (i = Blockly.JavaScript.allNestedComments(i)) && (r += Blockly.JavaScript.prefixLines(i, "// "))
    }
    return t = t.nextConnection && t.nextConnection.targetBlock(),
        r + o + (n ? "" : this.blockToCode(t))
}


Blockly.JavaScript.workspaceToCode = function (workspace) {
    if (!workspace) {
        // Backwards compatibility from before there could be multiple workspaces.
        console.warn('No workspace specified in workspaceToCode call.  Guessing.');
        workspace = Blockly.derivWorkspace;
    }
    var code = [];
    this.init(workspace);
    var blocks = workspace.getTopBlocks(true);
    for (var x = 0, block; block = blocks[x]; x++) {
        console.log(block)
        var line = Blockly.JavaScript.blockToCode(block, true);
        if (goog.isArray(line)) {
            // Value blocks return tuples of code and operator order.
            // Top-level blocks don't care about operator order.
            line = line[0];
        }
        if (line) {
            code.push(line);
        }
    }
    code = code.join('\n');  // Blank line between each section.
    // code = this.finish(code);
    // Final scrubbing of whitespace.
    code = code.replace(/^\s+\n/, '');
    code = code.replace(/undefined/g, '');
    
    code = code.replace(/\n\s+$/, '\n');
    code = code.replace(/[ \t]+\n/g, '\n');
    return code;
}

Blockly.JavaScript.statementToCode = function (e, t) {
    return e = e.getInputTargetBlock(t),
        t = this.blockToCode(e),
        goog.asserts.assertString(t, 'Expecting code from statement block "%s".', e && e.type),
        t && (t = this.prefixLines(t, this.INDENT)),
        t
}
Blockly.JavaScript.allNestedComments = function (e) {
    var t = [];
    e = e.getDescendants(!0);
    for (var o = 0; o < e.length; o++) {
        var n = e[o].getCommentText();
        n && t.push(n)
    }
    return t.length && t.push(""),
        t.join("\n")
}

Blockly.JavaScript.prefixLines = function (e, t) {
    return t + e.replace(/(?!\n$)\n/g, "\n" + t)
}
