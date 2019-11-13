import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.trade_definition_restartonerror = {
    init() {
        this.jsonInit({
            message0: translate('Restart last trade on error (bot ignores the unsuccessful trade): %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'RESTARTONERROR',
                    check: 'Boolean',
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
    onchange(/* event */) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }
        
        this.enforceLimitations();
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
    required_inputs   : ['RESTARTONERROR'],
};
Blockly.JavaScript.trade_definition_restartonerror = () => {};
