import { localize } from '@deriv/translations';

Blockly.Blocks.trade_definition_restartbuysell = {
    init() {
        this.jsonInit({
            message0: localize('Restart buy/sell on error (disable for better performance): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_image_checkbox',
                    name: 'TIME_MACHINE_ENABLED',
                    checked: false,
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
        this.setOnChange(() => {
            const next_block = this?.getNextBlock();
            if (next_block?.type !== 'trade_definition_restartonerror') {
                next_block?.unplug(true);
            }
        });
    },
    onchange(/* event */) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
    required_inputs: ['TIME_MACHINE_ENABLED'],
};
Blockly.JavaScript.trade_definition_restartbuysell = () => {};
