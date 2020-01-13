// import ScratchStore          from '../../../../../stores/scratch-store';
import { localize }          from '@deriv/translations';
import { setBlockTextColor } from '../../../../utils';

Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Ignore %1 %2'),
            args0   : [
                {
                    type: 'input_dummy',
                },
                {
                    type : 'input_statement',
                    name : 'USELESS_STACK',
                    check: null,
                },
            ],
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : localize('Put your blocks in here to prevent them from being removed'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            'display_name': localize('Ignore'),
            'description' : localize('Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.'),
        };
    },
    onchange(event) {
        setBlockTextColor(this, event);
    },
};

Blockly.JavaScript.block_holder = () => '';
