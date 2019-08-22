import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.controls_repeat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            type    : 'controls_repeat',
            message0: translate('repeat %1 times'),
            args0   : [
                {
                    type     : 'field_number',
                    name     : 'TIMES',
                    value    : 10,
                    min      : 0,
                    precision: 1,
                },
            ],
            message1: translate('do %1'),
            args1   : [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            colour           : Blockly.Colours.Binary.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.Binary.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Control Repeat Tooltip'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return  {
            'display_name': translate('Control Repeat'),
            'description' : translate('Control Repeat Description'),
        };
    },
};

Blockly.JavaScript.controls_repeat = Blockly.JavaScript.controls_repeat_ext;
