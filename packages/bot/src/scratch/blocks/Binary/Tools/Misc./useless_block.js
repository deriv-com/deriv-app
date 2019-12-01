import { localize }  from 'deriv-translations';
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
    onchange() {
        // TODO: uncomment this when the dark mode is done
        // if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        setBlockTextColor(this);
        // }
    },
};

Blockly.JavaScript.useless_block = () => {};
