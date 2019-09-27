import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.logic_boolean = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: '%1',
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'BOOL',
                    options: [[translate('true'), 'TRUE'], [translate('false'), 'FALSE']],
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns either True or False'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': translate('True-False'),
            'description' : translate('This is a single block that returns a boolean value, either true or false.'),
        };
    },
};

Blockly.JavaScript.logic_boolean = block => {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
