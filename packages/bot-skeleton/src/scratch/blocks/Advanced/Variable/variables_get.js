import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.variables_get = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            type: 'variables_get',
            message0: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('item'),
                },
            ],
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Special4.colour,
            colourSecondary: Blockly.Colours.Special4.colourSecondary,
            colourTertiary: Blockly.Colours.Special4.colourTertiary,
            tooltip: localize('Gets variable value'),
            category: Blockly.Categories.Variables,
        };
    },
    meta() {
        return {
            display_name: localize('User-defined variable'),
            description: '',
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
                        const param_field = block.getField('PARAMS');
                        if (param_field) {
                            block.setFieldValue(`${localize('with: ')} ${block.arguments.join(', ')}`, 'PARAMS');
                        }
                        const with_field = block.getField('WITH');
                        if (with_field) {
                            block.updateShape();
                        }
                    }
                }
            });
        }
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.variables_get = block => {
    // eslint-disable-next-line no-underscore-dangle
    const code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.CATEGORY_NAME);
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
