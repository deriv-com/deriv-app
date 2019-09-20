import config from '../../../../constants/const';

Blockly.Blocks.trade_definition_candleinterval = {
    init() {
        this.jsonInit({
            message0: 'Default Candle Interval: %1',
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals.slice(1),
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
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            this.enforceParent();
        }
    },
    enforceParent: Blockly.Blocks.trade_definition_market.enforceParent,
};
Blockly.JavaScript.trade_definition_candleinterval = () => {};
