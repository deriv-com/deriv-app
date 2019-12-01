import { localize } from 'deriv-translations';

Blockly.Blocks.logic_operation = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: '%1 %2 %3',
            args0   : [
                {
                    type: 'input_value',
                    name: 'A',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'OP',
                    options: [[localize('and'), 'AND'], [localize('or'), 'OR']],
                },
                {
                    type: 'input_value',
                    name: 'B',
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Performs selected logic operation'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': localize('Logic operation'),
            'description' : localize('This block performs the "AND" or the "OR" logic operation.'),
        };
    },
};

Blockly.JavaScript.logic_operation = block => {
    const selectedOperator = block.getFieldValue('OP');

    let operator,
        order;

    if (selectedOperator === 'AND') {
        operator = '&&';
        order = Blockly.JavaScript.ORDER_LOGICAL_AND;
    } else if (selectedOperator === 'OR') {
        operator = '||';
        order = Blockly.JavaScript.ORDER_LOGICAL_OR;
    }

    const argument0 = Blockly.JavaScript.valueToCode(block, 'A') || 'false';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'B') || 'false';

    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
};
