import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.slow_ema_period = {
    init() {
        this.jsonInit({
            message0: translate('Slow EMA Period %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'SLOW_EMA_PERIOD',
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
    allowedParents: ['macda_statement'],
};

Blockly.JavaScript.slow_ema_period = () => {};
