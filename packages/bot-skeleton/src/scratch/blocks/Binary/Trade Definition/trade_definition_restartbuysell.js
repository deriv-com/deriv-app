import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.trade_definition_restartbuysell = {
    init() {
        this.jsonInit({
            message0: localize('Restart buy/sell on error (disable for better performance): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_checkbox',
                    name: 'TIME_MACHINE_ENABLED',
                    checked: false,
                    class: 'blocklyCheckbox',
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
        if (!this.workspace || Blockly.derivWorkspace.isFlyoutVisible || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
    required_inputs: ['TIME_MACHINE_ENABLED'],
};
Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartbuysell = () => {};
