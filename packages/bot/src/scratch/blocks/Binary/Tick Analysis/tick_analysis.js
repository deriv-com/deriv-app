import { localize }          from 'deriv-translations';
import { setBlockTextColor } from '../../../utils';

// import ScratchStore          from '../../../../stores/scratch-store';

Blockly.Blocks.tick_analysis = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('The content of this block is called on every tick %1 %2'),
            args0   : [
                {
                    type: 'input_dummy',
                },
                {
                    type : 'input_statement',
                    name : 'TICKANALYSIS_STACK',
                    check: null,
                },
            ],
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : localize('You can use this block to analyze the ticks, regardless of your trades'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Run on every tick'),
            'description' : localize('The content of this block is called on every tick. Place this block outside of any root block.'),
        };
    },
    onchange() {
        // TODO: incomment this when the dark mode is done
        // if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        setBlockTextColor(this);
        // }

    },
};

Blockly.JavaScript.tick_analysis = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'TICKANALYSIS_STACK') || '';

    const code = `
    BinaryBotPrivateTickAnalysisList.push(function BinaryBotPrivateTickAnalysis() {
        ${stack}
    });\n`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
