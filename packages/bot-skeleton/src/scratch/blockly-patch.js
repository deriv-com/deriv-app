/* This is a patch file to make the lastest version work
of blockly to work since we are moving from version 3 to 10
*/
import { initializeOrderValues, sanitizeCodeForLastestBlockly } from "./shared";
/* eslint-disable no-param-reassign */
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
        /*jslint vars: true */
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
        // eslint-disable-next-line no-cond-assign
        isNaN(t) && goog.asserts.fail('Expecting valid order from value block "%s".', n.type),
        !e)
        return "";
    n = !1;
    var r = Math.floor(o)
        , i = Math.floor(t);
    if (this.ORDER_OVERRIDES) {
        for (var r = 0; r < this.ORDER_OVERRIDES.length; r++) {
            if (this.ORDER_OVERRIDES[r] && this.ORDER_OVERRIDES[r][0] == o && this.ORDER_OVERRIDES[r][1] == t) {
                n = false;
                break;
            }
        }
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
        // eslint-disable-next-line no-cond-assign
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

Blockly.JavaScript.provideFunction_ = function (desiredName, code) {
    if (!Blockly.JavaScript.definitions_[desiredName]) {
        code = code.map((code) => {
            return sanitizeCodeForLastestBlockly(code)
        })
        const functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            desiredName,
            Blockly.Procedures.NAME_TYPE,
        );
        Blockly.JavaScript.functionNames_[desiredName] = functionName;
        if (Array.isArray(code)) {
            code = code.join('\n');
        }
        let codeText = code
            .trim()
            .replace(Blockly.JavaScript.javascriptGenerator.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
        // Change all '  ' indents into the desired indent.
        // To avoid an infinite loop of replacements, change all indents to '\0'
        // character first, then replace them all with the indent.
        // We are assuming that no provided functions contain a literal null char.
        let oldCodeText;
        while (oldCodeText !== codeText) {
            oldCodeText = codeText;
            codeText = codeText.replace(/^(( {2})*) {2}/gm, '$1\0');
        }
        codeText = codeText.replace(/\0/g, this.INDENT);
        Blockly.JavaScript.definitions_[desiredName] = codeText;
    }
    return Blockly.JavaScript.functionNames_[desiredName];
}

Blockly.JavaScript.getAdjusted = function (
    block,
    atId,
    delta = 0,
    negate = false,
    order = Blockly.JavaScript.ORDER_NONE,
) {
    if (block.workspace.options.oneBasedIndex) {
        delta--;
    }
    const defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';

    let orderForInput = order;
    if (delta > 0) {
        orderForInput = Blockly.JavaScript.ORDER_ADDITION;
    } else if (delta < 0) {
        orderForInput = Blockly.JavaScript.ORDER_SUBTRACTION;
    } else if (negate) {
        orderForInput = Blockly.JavaScript.ORDER_UNARY_NEGATION;
    }

    let at = this.valueToCode(block, atId, orderForInput) || defaultAtIndex;

    // Easy case: no adjustments.
    if (delta === 0 && !negate) {
        return at;
    }
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
        at = `${at} + ${delta}`;
    } else if (delta < 0) {
        at = `${at} - ${-delta}`;
    }
    if (negate) {
        at = delta ? `-(${at})` : `-${at}`;
    }
    if (Math.floor(order) >= Math.floor(orderForInput)) {
        at = `(${at})`;
    }
    return at;
}

const orderValues = initializeOrderValues();
Object.keys(orderValues).forEach(prop => {
    Blockly.JavaScript[prop] = orderValues[prop];
});
/* eslint-disable no-param-reassign */