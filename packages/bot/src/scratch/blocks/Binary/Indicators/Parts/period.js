import { localize } from 'deriv-translations';

Blockly.Blocks.period = {
    init() {
        this.jsonInit({
            message0: localize('Period %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'PERIOD',
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
    allowed_parents: [
        'bb_statement',
        'bba_statement',
        'ema_statement',
        'emaa_statement',
        'macda_statement',
        'rsi_statement',
        'rsia_statement',
        'sma_statement',
        'smaa_statement',
    ],
};

Blockly.JavaScript.period = () => {};
