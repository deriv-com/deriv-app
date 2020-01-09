import { localize } from '@deriv/translations';
import {
    plusIconDark,
    minusIconDark,
}                   from '../images';

Blockly.Blocks.controls_if = {
    init() {
        this.else_if_count = 0;
        this.else_count = 0;

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
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom() {
        const container = document.createElement('mutation');

        if (this.else_if_count) {
            container.setAttribute('elseif', this.else_if_count);
        }

        if (this.else_count) {
            container.setAttribute('else', 1);
        }

        return container;
    },
    /**
     * Parse XML to restore the else-if and else inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation(xmlElement) {
        this.else_if_count = parseInt(xmlElement.getAttribute('elseif')) || 0;
        this.else_count = parseInt(xmlElement.getAttribute('else')) || 0;
        this.updateShape();
    },
    updateShape() {
        // Delete everything.
        this.removeInput('ELSE', true);
        this.removeInput('ELSE_LABEL', true);
        this.removeInput('DELETE_ELSE', true);

        let i = 1;

        while (this.getInput(`IF${i}`)) {
            this.removeInput(`IF_LABEL${i}`, true);
            this.removeInput(`IF${i}`, true);
            this.removeInput(`THEN_LABEL${i}`, true);
            this.removeInput(`DELETE_ICON${i}`, true);
            this.removeInput(`DO${i}`, true);
            i++;
        }

        if (this.getInput('MUTATOR')) {
            this.removeInput('MUTATOR');
        }

        // Rebuild block
        for (let j = 1; j <= this.else_if_count; j++) {
            this.appendDummyInput(`IF_LABEL${j}`).appendField(localize('else if'));
            this.appendValueInput(`IF${j}`).setCheck('Boolean');
            this.appendDummyInput(`THEN_LABEL${j}`).appendField(localize('then'));
            this.appendDummyInput(`DELETE_ICON${j}`).appendField(this.getRemoveInputIcon(j, false));
            this.appendStatementInput(`DO${j}`);
        }

        if (this.else_count) {
            this.appendDummyInput('ELSE_LABEL').appendField(localize('else'));
            this.appendDummyInput('DELETE_ELSE').appendField(this.getRemoveInputIcon(this.else_if_count + 1, true));
            this.appendStatementInput('ELSE');
        }

        this.appendDummyInput('MUTATOR').appendField(this.getAddInputIcon());

        this.initSvg();
        this.render();
    },
    getAddInputIcon() {
        const onAddClick = () => {
            if (!this.workspace || this.isInFlyout) {
                return;
            }

            const old_mutation_dom = this.mutationToDom();
            const new_input_num    = this.else_if_count + 1;

            if (this.else_count === 0) {
                // No `elseif`, just add an `else`-statement
                this.appendDummyInput('ELSE_LABEL').appendField(localize('else'));
                this.appendDummyInput('DELETE_ELSE').appendField(this.getRemoveInputIcon(new_input_num, true));
                this.appendStatementInput('ELSE');

                this.else_count++;
            } else {
                // We've already got else + elseifs, keep adding elseifs into infinity.
                this.appendDummyInput(`IF_LABEL${new_input_num}`).appendField(localize('else if'));
                this.appendValueInput(`IF${new_input_num}`).setCheck('Boolean');
                this.appendDummyInput(`THEN_LABEL${new_input_num}`).appendField(localize('then'));
                this.appendDummyInput(`DELETE_ICON${new_input_num}`).appendField(
                    this.getRemoveInputIcon(new_input_num, false)
                );
                this.appendStatementInput(`DO${new_input_num}`);

                this.else_if_count++;
            }

            // We already have an else, this input needs to be moved to the bottom where it belongs.
            if (this.getInput('ELSE')) {
                this.moveInputBefore('ELSE_LABEL', null);
                this.moveInputBefore('DELETE_ELSE', null);
                this.moveInputBefore('ELSE', null);
            }

            // Move plus-icon to the bottom
            this.moveInputBefore('MUTATOR', null);

            this.initSvg();
            this.render();

            // Fire a mutation event so this can be undone/redone.
            const old_mutation = Blockly.Xml.domToText(old_mutation_dom);
            const new_mutation = Blockly.Xml.domToText(this.mutationToDom());

            Blockly.Events.fire(new Blockly.Events.Change(this, 'mutation', null, old_mutation, new_mutation));
        };

        return new Blockly.FieldImage(plusIconDark, 24, 24, '+', onAddClick.bind(this));
    },
    getRemoveInputIcon(index, is_else_stack) {
        const onRemoveClick = () => {
            if (!this.workspace || this.isInFlyout) {
                return;
            }

            const old_mutation_dom = this.mutationToDom();

            if (is_else_stack) {
                this.removeInput('ELSE_LABEL');
                this.removeInput('DELETE_ELSE');
                this.removeInput('ELSE');
                this.else_count = 0;
            } else {
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
                        const newIndex = index + j;
                        larger_input.name = input_name + newIndex;

                        // Re-attach click handler with correct index.
                        if (input_name === 'DELETE_ICON') {
                            for (let k = 0; k < larger_input.fieldRow.length; k++) {
                                const field = larger_input.fieldRow[k];
                                field.dispose();
                                larger_input.fieldRow.splice(k, 1);
                            }

                            larger_input.appendField(this.getRemoveInputIcon(newIndex, false));
                        }

                        i++;
                        j++;

                        larger_input = this.getInput(input_name + (index + i));
                    }
                });

                this.else_if_count--;
            }

            // Fire a mutation event so this can be undone/redone.
            const old_mutation = Blockly.Xml.domToText(old_mutation_dom);
            const new_mutation = Blockly.Xml.domToText(this.mutationToDom());

            Blockly.Events.fire(new Blockly.Events.Change(this, 'mutation', null, old_mutation, new_mutation));
        };

        return new Blockly.FieldImage(minusIconDark, 24, 24, '-', onRemoveClick.bind(this));
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
