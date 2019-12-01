import { localize }    from 'deriv-translations';
import { expectValue } from '../../../shared';
import config          from '../../../../constants';

Blockly.Blocks.bb_statement = {
    protected_statements : ['STATEMENT'],
    required_child_blocks: ['input_list', 'period', 'std_dev_multiplier_up', 'std_dev_multiplier_down'],
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('set %1 to Bollinger Bands %2 %3'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'bb',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'BBRESULT_LIST',
                    options: config.bbResult,
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type : 'input_statement',
                    name : 'STATEMENT',
                    check: null,
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            tooltip          : localize('Calculates Bollinger Bands (BB) from a list with a period'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta(){
        return {
            'display_name': localize('Bollinger Bands (BB)'),
            'description' : localize('BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            const blocksInStatement = this.getBlocksInStatement('STATEMENT');
            blocksInStatement.forEach(block => {
                if (!this.required_child_blocks.includes(block.type)) {
                    Blockly.Events.disable();
                    block.unplug(false);
                    Blockly.Events.enable();
                }
            });
        }
    },
};

Blockly.JavaScript.bb_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const bbResult = block.getFieldValue('BBRESULT_LIST');
    const input = expectValue(block.getChildByType('input_list'), 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD') || '10';
    const stdDevUp = block.childValueToCode('std_dev_multiplier_up', 'UPMULTIPLIER') || '5';
    const stdDevDown = block.childValueToCode('std_dev_multiplier_down', 'DOWNMULTIPLIER') || '5';

    const code = `${varName} = Bot.bb(${input}, { periods: ${period}, stdDevUp: ${stdDevUp}, stdDevDown: ${stdDevDown} }, ${bbResult});\n`;
    return code;
};
