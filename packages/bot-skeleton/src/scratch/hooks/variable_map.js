// console.log('20')
// Blockly.VariableMap.prototype.createVariable = function (name, opt_type, opt_id, opt_is_local, opt_is_cloud) {
//     let variable = this.getVariable(name, opt_type);

//     if (variable) {
//         return variable;
//     }

//     if (opt_id) {
//         variable = this.getVariableById(opt_id);

//         if (variable) {
//             return variable;
//         }
//     }

//     const optional_id = opt_id || Blockly.utils.idGenerator.genUid();
//     const optional_type = opt_type || '';

//     variable = new Blockly.VariableModel(this.workspace, name, optional_type, optional_id, opt_is_local, opt_is_cloud);

//     // If opt_type is not a key, create a new list.
//     console.log({
//         variable: variable,
//         optional_type,
//         variableMap: this.variableMap
//     })
//     if (!this.variableMap[optional_type]) {
//         console.log('if matched')
//         this.variableMap[optional_type] = [variable];
//     } else {
//         console.log('else matched')
//         // Else append the variable to the preexisting list.
//         this.variableMap[optional_type].push(variable);
//     }

//     return variable;
// };
// console.log('20')