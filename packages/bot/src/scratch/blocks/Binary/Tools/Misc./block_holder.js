// import ScratchStore          from '../../../../../stores/scratch-store';
import { setBlockTextColor } from '../../../../utils';
import { translate }         from '../../../../../utils/lang/i18n';

Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: translate('Ignore %1 %2'),
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
            tooltip        : translate('Put your blocks in here to prevent them from being removed'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            'display_name': translate('Ignore'),
            'description' : translate('Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.'),
        };
    },
    onchange() {
        // TODO: incomment this when the dark mode is done
        //        if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        setBlockTextColor(this);
        //        }

    },
};

Blockly.JavaScript.block_holder = () => '';
