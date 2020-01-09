import { localize }  from '@deriv/translations';
import { setBlockTextColor } from '../../../../utils';

Blockly.Blocks.useless_block = {
    init() {
        this.jsonInit({
            message0         : localize('Conversion Helper Block'),
            colour           : Blockly.Colours.RootBlock.colour,
            colourSecondary  : Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary   : Blockly.Colours.RootBlock.colourTertiary,
            tooltip          : localize('This block was required to correctly convert your old strategy.'),
            category         : Blockly.Categories.Miscellaneous,
            nextStatement    : null,
            previousStatement: null,
        });
    },
    onchange(event) {
        setBlockTextColor(this, event);
    },
};

Blockly.JavaScript.useless_block = () => {};
