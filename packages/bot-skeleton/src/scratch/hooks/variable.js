/* This overrides the createVariable method of Blockly.VariableMap.prototype.createVariable.
This was done to allow for the creation of variables with the same name but different sentence case (ex: ema, EMA).
This was done because with the update of new blockly. It does not support variables with same names irrespective of the sentence case.
In Order to fix this issue we are avoid throwing error if the name is same but the sentence case is different and we are appending a _ in the duplicated variable. */

Blockly.VariableMap.prototype.createVariable = function (name, opt_type, opt_id) {
    let variable = this.getVariable(name, opt_type);
    if (variable && variable?.name === name) {
        if (opt_id && variable.getId() !== opt_id) {
            throw Error(
                `Variable "${name}" is already in use and its id is "${variable.getId()}" which conflicts with the passed in ` +
                    `id, "${opt_id}".`
            );
        }
        // The variable already exists and has the same ID.
        return variable;
    }
    if (opt_id && this.getVariableById(opt_id)) {
        throw Error(`Variable id, "${opt_id}", is already in use.`);
    }
    const id = opt_id || Blockly.utils.idGenerator.genUid();
    const type = opt_type || '';
    variable = new Blockly.VariableModel(this.workspace, variable ? `${name}_` : name, type, id);

    const variables = this.variableMap.get(type) || [];
    variables.push(variable);
    // Delete the list of variables of this type, and re-add it so that
    // the most recent addition is at the end.
    // This is used so the toolbox's set block is set to the most recent
    // variable.
    this.variableMap.delete(type);
    this.variableMap.set(type, variables);

    Blockly.Events.fire(new (Blockly.Events.get(Blockly.Events.VAR_CREATE))(variable));

    return variable;
};
