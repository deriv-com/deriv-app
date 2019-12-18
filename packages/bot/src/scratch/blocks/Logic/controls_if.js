import { localize } from 'deriv-translations';
import {
    plusIconDark,
    minusIconDark,
}                   from '../images';

Blockly.Blocks.controls_if = {
    init() {
        this.elseIfCount = 0;
        this.elseCount = 0;

        this.jsonInit(this.definition());

        const addInputIcon = this.getAddInputIcon();
        this.appendDummyInput('MUTATOR').appendField(addInputIcon);
    },
    definition(){
        return {
            message0: localize('if %1 then'),
            message1: '%1',
            args0   : [
                {
                    type : 'input_value',
                    name : 'IF0',
                    check: 'Boolean',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO0',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Conditional block'),
            category         : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': localize('Conditional block'),
            'description' : localize('This block evaluates a statement and will perform an action only when the statement is true.'),
        };
    },
    mutationToDom() {
        if (!this.elseIfCount && !this.elseCount) {
            return null;
        }

        const container = document.createElement('mutation');

        if (this.elseIfCount) {
            container.setAttribute('elseif', this.elseIfCount);
        }

        if (this.elseCount) {
            container.setAttribute('else', 1);
        }

        return container;
    },
    domToMutation(xmlElement) {
        this.elseIfCount = parseInt(xmlElement.getAttribute('elseif')) || 0;
        this.elseCount   = parseInt(xmlElement.getAttribute('else')) || 0;
        this.updateShape();
    },
    updateShape() {
        // Delete everything.
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
        }

        let i = 1;

        const if_input_name = `IF${i}`;

        while (this.getInput(if_input_name)) {
            this.removeInput(if_input_name);
            this.removeInput(`DO${i}`);
            i++;
        }

        if (this.getInput('MUTATOR')) {
            this.removeInput('MUTATOR');
        }

        // Rebuild block
        for (let j = 1; j <= this.elseIfCount; j++) {
            this.appendDummyInput(`IF_LABEL${j}`).appendField(localize('else if'));
            this.appendValueInput(`IF${j}`).setCheck('Boolean');
            this.appendDummyInput(`THEN_LABEL${j}`).appendField(localize('then'));
            this.appendDummyInput(`DELETE_ICON${j}`).appendField(this.getRemoveInputIcon(j, false));
            this.appendStatementInput(`DO${j}`);
        }

        if (this.elseCount) {
            this.appendDummyInput('ELSE_LABEL').appendField(localize('else'));
            this.appendDummyInput('DELETE_ELSE').appendField(this.getRemoveInputIcon(this.elseIfCount + 1, true));
            this.appendStatementInput('ELSE');
        }

        this.appendDummyInput('MUTATOR').appendField(this.getAddInputIcon());

        this.initSvg();
        this.render();
    },
    getAddInputIcon() {
        return new Blockly.FieldImage(plusIconDark, 24, 24, '+', () => {
            if (!this.workspace || this.isInFlyout) {
                return;
            }

            const input_number = this.elseIfCount + 1;

            if (this.elseCount === 0) {
                // There is no else if, so just add an else-statement.
                const remove_input_icon = this.getRemoveInputIcon(input_number, true);

                this.appendDummyInput('ELSE_LABEL').appendField(localize('else'));
                this.appendDummyInput('DELETE_ELSE').appendField(remove_input_icon);
                this.appendStatementInput('ELSE');

                this.elseCount++;
            } else {
                // We already have an else statement so add an else-if statement.
                this.appendDummyInput(`IF_LABEL${input_number}`).appendField(localize('else if'));
                this.appendValueInput(`IF${input_number}`).setCheck('Boolean');
                this.appendDummyInput(`THEN_LABEL${input_number}`).appendField(localize('then'));
                this.appendDummyInput(`DELETE_ICON${input_number}`).appendField(
                    this.getRemoveInputIcon(input_number, false)
                );
                this.appendStatementInput(`DO${input_number}`);

                this.elseIfCount++;
            }

            if (this.getInput('ELSE')) {
                // If we have an else, move it to the bottom of the statements.
                this.moveInputBefore('ELSE_LABEL', null);
                this.moveInputBefore('DELETE_ELSE', null);
                this.moveInputBefore('ELSE', null);
            }

            this.moveInputBefore('MUTATOR', null); // Move plus icon to the bottom.
            this.initSvg();
            this.render();
        });
    },
    getRemoveInputIcon(index, isElseStack) {
        return new Blockly.FieldImage(minusIconDark, 24, 24, '-', () => {
            if (!this.workspace || this.isInFlyout) {
                return;
            }

            if (isElseStack) {
                this.removeInput('ELSE_LABEL');
                this.removeInput('DELETE_ELSE');
                this.removeInput('ELSE');
                this.elseCount = 0;
                return;
            }

            if (isElseStack) {
                this.removeInput('ELSE_LABEL');
                this.removeInput('DELETE_ELSE');
                this.removeInput('ELSE');
                this.elseCount = 0;
            }

            // Determine which label it is, has to be done inside this function.
            const input_names = ['IF_LABEL', 'IF', 'THEN_LABEL', 'DELETE_ICON', 'DO'];

            input_names.forEach(input_name => {
                this.removeInput(`${input_name}${index}`);

                // Re-number inputs w/ indexes larger than this one, e.g. when removing `IF5` becomes `IF4`
                let i = 1;
                let j = 0;

                // e.g. we've removed `IF5`, name of larger input `IF6` should become `IF5`
                let larger_input = this.getInput(input_name + (index + i));

                while (larger_input) {
                    const new_input_index = index + j;
                    larger_input.name     = input_name + new_input_index;

                    // Re-attach click handler with correct index.
                    if (input_name === 'DELETE_ICON') {
                        for (let k = 0; k < larger_input.fieldRow.length; k++) {
                            const field = larger_input.fieldRow[k];

                            field.dispose();
                            larger_input.fieldRow.splice(k, 1);
                        }

                        const remove_input_icon = this.getRemoveInputIcon(new_input_index, false);
                        larger_input.appendField(remove_input_icon);
                    }

                    i++;
                    j++;

                    larger_input = this.getInput(input_name + (index + i));
                }
            });

            this.elseIfCount--;
        });
    },
    getRequiredValueInputs() {
        const required_inputs = {};
        this.inputList
            .filter(input => /^IF[0-9]*?$/.test(input.name))
            .forEach(input => required_inputs[input.name] = null);

        return required_inputs;
    },
};

Blockly.JavaScript.controls_if = block => {
    // If/elseif/else condition.
    let n = 0;
    let code = '';

    do {
        const condition = Blockly.JavaScript.valueToCode(block, `IF${n}`, Blockly.JavaScript.ORDER_NONE) || 'false';

        // i.e. (else)? if { // code }
        const keyword = n > 0 ? 'else if' : 'if';
        code += `
        ${keyword} (${condition}) {
            ${Blockly.JavaScript.statementToCode(block, `DO${n}`)}
        }`;
        n++;
    } while (block.getInput(`IF${n}`));

    if (block.getInput('ELSE')) {
        code += `
        else {
            ${Blockly.JavaScript.statementToCode(block, 'ELSE')}
        }`;
    }

    return `${code}\n`;
};
