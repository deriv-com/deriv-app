import { expectValue } from '../../../shared';
import config          from '../../../../constants';
import { translate }   from '../../../../utils/lang/i18n';

Blockly.Blocks.macda_statement = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('set %1 to MACD Array %2 %3'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'macda',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'MACDFIELDS_LIST',
                    options: config.macdFields,
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
            colour           : Blockly.Colours.Special4.colour,
            colourSecondary  : Blockly.Colours.Special4.colourSecondary,
            colourTertiary   : Blockly.Colours.Special4.colourTertiary,
            tooltip          : translate('Calculates Moving Average Convergence Divergence (MACD) from a list'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta(){
        return {
<<<<<<< Updated upstream
            'display_name': translate('Moving Average Convergence Divergence'),
            'description' : translate('MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.'),
=======
            'display_name': translate('Moving Average Convergence Divergence (MACD)'),
            'description' : translate('MACD acronym stands for Moving Average Convergence Divergence. MACD is calculated by subtracting the long-term Exponential Moving Average (26 periods) from the short-term Exponential Moving Average (12 periods). The idea behind the MACD indicator is that when the short-term EMA is greater or lower than long-term EMA than there’s a possibility of trend reversal.'),
>>>>>>> Stashed changes
        };
    },
    
    onchange           : Blockly.Blocks.bb_statement.onchange,
    requiredParamBlocks: ['input_list', 'fast_ema_period', 'slow_ema_period', 'signal_ema_period'],
};

Blockly.JavaScript.macda_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const macdField = block.getFieldValue('MACDFIELDS_LIST');
    const input = expectValue(block.getChildByType('input_list'), 'INPUT_LIST');
    const fastEmaPeriod = block.childValueToCode('fast_ema_period', 'FAST_EMA_PERIOD') || '12';
    const slowEmaPeriod = block.childValueToCode('slow_ema_period', 'SLOW_EMA_PERIOD') || '26';
    const signalEmaPeriod = block.childValueToCode('signal_ema_period', 'SIGNAL_EMA_PERIOD') || '9';

    const code = `${varName} = Bot.macda(${input}, { 
        fastEmaPeriod: ${fastEmaPeriod},
        slowEmaPeriod: ${slowEmaPeriod},
        signalEmaPeriod: ${signalEmaPeriod},
    }, ${macdField});\n`;
    return code;
};
