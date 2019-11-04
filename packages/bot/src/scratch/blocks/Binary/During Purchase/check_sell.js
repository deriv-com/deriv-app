import { localize } from 'deriv-translations/lib/i18n';

Blockly.Blocks.check_sell = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Sell is available'),
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('True if active contract can be sold before expiration at current market price'),
            category       : Blockly.Categories.During_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Can contract be sold?'),
            'description' : localize('This block returns ‘True’ if purchased contract can be sold. Otherwise it returns an empty string.'),
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

Blockly.JavaScript.check_sell = () => {
    const code = 'Bot.isSellAvailable()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
