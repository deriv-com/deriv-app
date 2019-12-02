Blockly.Generator.prototype.provideFunction_ = function(desired_function_name, code) {
    if (!this.definitions_ || !this.functionNames_) {
        Blockly.JavaScript.init(Blockly.derivWorkspace);
    }

    if (!this.definitions_[desired_function_name]) {
        const functionName = this.variableDB_.getDistinctName(desired_function_name, Blockly.Procedures.NAME_TYPE);
        this.functionNames_[desired_function_name] = functionName;
        let code_text = code.join('\n').replace(this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);

        // Change all '  ' indents into the desired indent.
        // To avoid an infinite loop of replacements, change all indents to '\0'
        // character first, then replace them all with the indent.
        // We are assuming that no provided functions contain a literal null char.
        let old_code_text;

        while (old_code_text != code_text) {
            old_code_text = code_text;
            code_text     = code_text.replace(/^(( {2})*) {2}/gm, '$1\0');
        }

        code_text = code_text.replace(/\0/g, this.INDENT);
        this.definitions_[desired_function_name] = code_text;
    }

    return this.functionNames_[desired_function_name];
};
