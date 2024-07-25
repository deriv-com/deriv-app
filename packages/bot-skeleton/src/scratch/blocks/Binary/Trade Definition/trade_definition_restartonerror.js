import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.trade_definition_restartonerror = {
    init() {
        this.jsonInit({
            message0: localize('Restart last trade on error (bot ignores the unsuccessful trade): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_checkbox',
                    name: 'RESTARTONERROR',
                    checked: true,
                    class: 'blocklyCheckbox',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setNextStatement(false);
        this.setMovable(false);
        this.setDeletable(false);
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
    required_inputs: ['RESTARTONERROR'],
};

Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartonerror = () => {};
