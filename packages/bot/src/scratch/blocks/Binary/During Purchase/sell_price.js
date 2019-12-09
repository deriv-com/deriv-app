import { localize } from 'deriv-translations';

Blockly.Blocks.sell_price = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Sell profit/loss'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the profit/loss form selling at market price'),
            category       : Blockly.Categories.During_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Profit/loss from selling'),
            'description' : localize('This block gives you the potential profit or loss if you decide to sell your contract.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.END_DRAG) {
            if (this.isDescendantOf('during_purchase')) {
                if (this.disabled) {
                    this.setDisabled(false);
                }
            } else if (!this.disabled) {
                this.setDisabled(true);
            }
        }
    },
};

Blockly.JavaScript.sell_price = () => {
    const code = 'Bot.getSellPrice()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
