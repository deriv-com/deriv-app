import { localize } from 'deriv-translations';

Blockly.Blocks.trade_again = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition(){
        return {
            message0         : localize('Trade again'),
            colour           : Blockly.Colours.Special1.colour,
            colourSecondary  : Blockly.Colours.Special1.colourSecondary,
            colourTertiary   : Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            tooltip          : localize('This blocks transfers control to the Purchase conditions block.'),
            category         : Blockly.Categories.After_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Trade again'),
            'description' : localize('This block will transfer the control back to the Purchase conditions block, enabling you to purchase another contract.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.END_DRAG) {
            if (this.isDescendantOf('after_purchase')) {
                if (this.disabled) {
                    this.setDisabled(false);
                }
            } else if (!this.disabled) {
                this.setDisabled(true);
            }
        }
    },
};

Blockly.JavaScript.trade_again = () => {
    const code = `
        Bot.isTradeAgain(true);\n
        return true;\n
    `;

    return code;
};
