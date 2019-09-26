import { translate } from '../../../../../utils/lang/i18n';
import { setBlockTextColor } from '../../../../utils';

Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
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
    meta(){
        return {
            'display_name': translate('Ignore'),
            'description' : translate('In case if you want to temporarily exclude some blocks from your scenario, you can simply put them inside of this block. They won’t be executed.'),
        };
    },
    onchange() {
        setBlockTextColor(this);
    },
};

Blockly.JavaScript.block_holder = () => '';
