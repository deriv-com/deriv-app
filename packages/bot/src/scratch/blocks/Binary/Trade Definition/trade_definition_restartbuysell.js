import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.trade_definition_restartbuysell = {
    init() {
        this.jsonInit({
            message0: translate('Restart buy/sell on error (disable for better performance): %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'TIME_MACHINE_ENABLED',
                    check: 'Boolean',
                },
            ],
            colour           : Blockly.Colours.TradeDefinition.colour,
            colourSecondary  : Blockly.Colours.TradeDefinition.colourSecondary,
            colourTertiary   : Blockly.Colours.TradeDefinition.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange() {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
};
Blockly.JavaScript.trade_definition_restartbuysell = () => {};
