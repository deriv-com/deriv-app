import { localize }    from 'deriv-translations';
import { expectValue } from '../../../shared';
import config          from '../../../../constants';

Blockly.Blocks.bba_statement = {
    protected_statements : ['STATEMENT'],
    required_child_blocks: ['input_list', 'period', 'std_dev_multiplier_up', 'std_dev_multiplier_down'],
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('set %1 to Bollinger Bands Array %2 %3'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'bba',
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
            tooltip          : localize('Calculates Bollinger Bands (BB) list from a list with a period'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta(){
        return {
            'display_name': localize('Bollinger Bands Array (BBA)'),
            'description' : localize('Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.bba_statement = block => {
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

    const code = `${varName} = Bot.bba(${input}, { periods: ${period}, stdDevUp: ${stdDevUp}, stdDevDown: ${stdDevDown} }, ${bbResult});\n`;
    return code;
};
