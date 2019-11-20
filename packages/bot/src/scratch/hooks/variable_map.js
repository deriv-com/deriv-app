Blockly.VariableMap.prototype.createVariable = function(name, opt_type, opt_id, opt_is_local, opt_is_cloud) {
    let variable = this.getVariable(name, opt_type);

    if (variable) {
        return variable;
    }

    if (opt_id) {
        variable = this.getVariableById(opt_id);

        if (variable) {
            return variable;
        }
    }

    const optional_id   = opt_id || Blockly.utils.genUid();
    const optional_type = opt_type || '';

    variable = new Blockly.VariableModel(this.workspace, name, optional_type, optional_id, opt_is_local, opt_is_cloud);

    // If opt_type is not a key, create a new list.
    if (!this.variableMap_[optional_type]) {
        this.variableMap_[optional_type] = [variable];
    } else {
        // Else append the variable to the preexisting list.
        this.variableMap_[optional_type].push(variable);
    }
  
    return variable;
};
