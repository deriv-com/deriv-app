import config from '../../../../constants';

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
            colour           : Blockly.Colours.BinaryLessPurple.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.BinaryLessPurple.colourTertiary,
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
Blockly.JavaScript.trade_definition_candleinterval = () => {};
