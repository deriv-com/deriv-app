import { localize } from 'deriv-translations';

Blockly.Blocks.math_number = {
    init() {
        this.jsonInit(this.definition());

        const fieldInput = this.getField('NUM');
        fieldInput.setValidator(input => this.numberValidator(input));
    },
    definition(){
        return {
            message0: '%1',
            args0   : [
                {
                    type : 'field_number',
                    name : 'NUM',
                    value: 0,
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Please use `.` as a decimal separator for fractional numbers.'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': localize('Number block'),
            'description' : localize('Enter an integer or fractional number into this block. Please use `.` as a decimal separator for fractional numbers.'),
        };
    },
    numberValidator(input) {
        if (/^-?([0][,.]|[1-9]+[,.])?([0]|[1-9])*$/.test(input)) {
            return undefined;
        }
        return null;
    },
};

Blockly.JavaScript.math_number = block => {
    const code = block.getFieldValue('NUM');
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
