import { localize } from 'deriv-translations';

Blockly.Blocks.variables_get = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            type    : 'variables_get',
            message0: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VAR',
                    variable: localize('item'),
                },
            ],
            output         : null,
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Special2.colour,
            colourSecondary: Blockly.Colours.Special2.colourSecondary,
            colourTertiary : Blockly.Colours.Special2.colourTertiary,
            tooltip        : localize('Gets variable value'),
            category       : Blockly.Categories.Variables,
        };
    },
    meta(){
        return {
            'display_name': localize('User-defined variable'),
            'description' : localize(''),
        };
    },
};

Blockly.JavaScript.variables_get = block => {
    // eslint-disable-next-line no-underscore-dangle
    const code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
