import { expectValue } from '../../../shared';
import { translate }   from '../../../../utils/lang/i18n';

Blockly.Blocks.ema_statement = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('set %1 to Exponentional Moving Average %2'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'ema',
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
            tooltip          : translate('Calculates Exponential Moving Average (EMA) from a list with a period'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta(){
        return {
            'display_name': translate('Exponential Moving Average (EMA)'),
            'description' : translate('An exponential moving average (EMA) is a type of moving average (MA) that places a greater weight and significance on the most recent data points. The exponential moving average is also referred to as the exponentially weighted moving average. An exponentially weighted moving average reacts more significantly to recent price changes than a simple moving average (SMA), which applies an equal weight to all observations in the period.'),
        };
    },
    onchange           : Blockly.Blocks.bb_statement.onchange,
    requiredParamBlocks: ['input_list', 'period'],
};

Blockly.JavaScript.ema_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const input = expectValue(block.getChildByType('input_list'), 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD') || '10';

    const code = `${varName} = Bot.ema(${input}, ${period});\n`;
    return code;
};
