import { expectValue } from '../../../shared';
import { translate }   from '../../../../utils/lang/i18n';

Blockly.Blocks.rsi_statement = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('set %1 to Relative Strength Index %2'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'rsi',
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
            tooltip          : translate('Relative Strength Index (RSI) from a list with a period'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta(){
        return {
            'display_name': translate('Relative Strength Index (RSI)'),
            'description' : translate('Relative Strength Index (RSI) is a technical analysis tool which helps in trend identification. RSI measures the magnitude of recent price changes. It can have a reading from 0 to 100. Typically, RSI value of 70 and above indicates that a security is overbought and the current trend may reverse or price correction may occur. A value of 30 or below, indicates that a security id oversold. The indicator was originally developed by J. Welles Wilder Jr. and introduced in his seminal 1978 book, New Concepts in Technical Trading Systems.'),
        };
    },
    onchange           : Blockly.Blocks.bb_statement.onchange,
    requiredParamBlocks: ['input_list', 'period'],
};

Blockly.JavaScript.rsi_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const input = expectValue(block.getChildByType('input_list'), 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD') || '10';

    const code = `${varName} = Bot.rsi(${input}, ${period});\n`;
    return code;
};
