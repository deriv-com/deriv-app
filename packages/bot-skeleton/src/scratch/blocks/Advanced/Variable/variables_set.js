import { localize } from '@deriv/translations';

Blockly.Blocks.variables_set = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            type: 'field_variable',
            message0: localize('set {{ variable }} to {{ value }}', {
                variable: '%1',
                value: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('item'),
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            colour: Blockly.Colours.Special2.colour,
            colourSecondary: Blockly.Colours.Special2.colourSecondary,
            colourTertiary: Blockly.Colours.Special2.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Sets variable value'),
            category: Blockly.Categories.Variables,
        };
    },
    meta() {
        return {
            display_name: localize('Set variable'),
            description: localize('Assigns a given value to a variable'),
        };
    },
    onchange(event) {
        if (event.type === Blockly.Events.VAR_RENAME) {
            const all_blocks = this.workspace.getAllBlocks();
            const function_blocks = all_blocks.filter(block => block.category_ === 'custom_functions');
            const old_param = event.oldName;
            const new_param = event.newName;
            function_blocks.forEach(block => {
                if (block.arguments?.length) {
                    const param_index = block.arguments.findIndex(item => item === old_param);
                    if (param_index !== -1) {
                        block.arguments[param_index] = new_param;
                        const paramField = block.getField('PARAMS');
                        if (paramField) {
                            block.setFieldValue(`${localize('with: ')} ${block.arguments.join(', ')}`, 'PARAMS');
                        }
                        const with_field = block.getField('WITH');
                        if (with_field) {
                            block.updateShape();
                        }
                        // block.initSvg();
                        // block.render(false);
                    }
                }
            });
        }
    },
};

Blockly.JavaScript.variables_set = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    const code = `${varName} = ${argument0};\n`;
    return code;
};
