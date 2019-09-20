import config        from '../../../../../constants/const';
import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.ohlc_values_in_list = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Make a list of %1 values from candles list %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'OHLCFIELD_LIST',
                    options: config.ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'OHLCLIST',
                },
            ],
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate('Returns a specific value from a given candle list'),
            category       : Blockly.Categories.Candle,
        };
    },
    meta(){
        return {
            'display_name': translate('Get values from candles (2)'),
            'description' : translate('This block extracts selected type of values from a given candle list'),
        };
    },
};

Blockly.JavaScript.ohlc_values_in_list = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST') || 'open';
    const ohlcList = Blockly.JavaScript.valueToCode(block, 'OHLCLIST') || '[]';

    const code = `Bot.candleValues(${ohlcList}, '${ohlcField}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
