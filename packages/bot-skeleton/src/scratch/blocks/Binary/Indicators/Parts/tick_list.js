import { localize } from '@deriv/translations';

Blockly.Blocks.tick_list = {
    init() {
        this.jsonInit({
            message0: localize('Tick List %1'),
            args0: [
                {
                    type: 'input_value',
                    name: 'TICK_LIST',
                    check: 'Array',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange: Blockly.Blocks.input_list.onchange,
    allowed_parents: [
        'atr_statement',
        'atra_statement',
        'so_statement',
        'soa_statement',
        'wr_statement',
        'wra_statement',
    ],
    getRequiredValueInputs() {
        return {
            TICK_LIST: null,
        };
    },
};

Blockly.JavaScript.tick_list = () => {};
