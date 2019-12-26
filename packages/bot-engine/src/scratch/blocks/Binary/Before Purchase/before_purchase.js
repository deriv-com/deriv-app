import { localize }          from 'deriv-translations';
import { purchase }          from '../../images';
import { setBlockTextColor } from '../../../utils';

// import ScratchStore          from '../../../../stores/scratch-store';

Blockly.Blocks.before_purchase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('%1 2. Purchase conditions %2'),
            message1: '%1',
            args0   : [
                {
                    type  : 'field_image',
                    src   : purchase,
                    width : 25,
                    height: 25,
                    alt   : 'P',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type : 'input_statement',
                    name : 'BEFOREPURCHASE_STACK',
                    check: 'Purchase',
                },
            ],
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : localize('Specify contract type and purchase conditions.'),
            category       : Blockly.Categories.Before_Purchase,
        };
    },
    meta(){
        return {
            'display_name': localize('Purchase conditions'),
            'description' : localize('This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.'),
        };
    },
    onchange(event) {
        // TODO: incomment this when the dark mode is done
        // if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        setBlockTextColor(this);
        // }

        if (!this.workspace || this.isInFlyout) {
            return;
        }

        // Maintain single instance of this block
        if (event.type === Blockly.Events.BLOCK_CREATE) {
            if (event.ids && event.ids.includes(this.id)) {
                this.workspace.getAllBlocks(true).forEach(block => {
                    if (block.type === this.type && block.id !== this.id) {
                        block.dispose();
                    }
                });
            }
        }
    },
};

Blockly.JavaScript.before_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'BEFOREPURCHASE_STACK');

    const code = `BinaryBotPrivateBeforePurchase = function BinaryBotPrivateBeforePurchase() {
        ${stack}
    };\n`;
    return code;
};
