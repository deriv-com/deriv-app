import { localize } from 'deriv-translations';

Blockly.Blocks.slow_ema_period = {
    init() {
        this.jsonInit({
            message0: localize('Slow EMA Period %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'SLOW_EMA_PERIOD',
                    check: null,
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange       : Blockly.Blocks.input_list.onchange,
    allowed_parents: ['macda_statement'],
};

Blockly.JavaScript.slow_ema_period = () => {};
