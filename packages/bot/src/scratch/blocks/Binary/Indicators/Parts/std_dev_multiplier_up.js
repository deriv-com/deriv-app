import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.std_dev_multiplier_up = {
    init() {
        this.jsonInit({
            message0: translate('Standard Deviation Up Multiplier %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'UPMULTIPLIER',
                    check: null,
                },
            ],
            colour           : Blockly.Colours.Special4.colour,
            colourSecondary  : Blockly.Colours.Special4.colourSecondary,
            colourTertiary   : Blockly.Colours.Special4.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange      : Blockly.Blocks.input_list.onchange,
    allowedParents: ['bb_statement', 'bba_statement'],
};

Blockly.JavaScript.std_dev_multiplier_up = () => {};
