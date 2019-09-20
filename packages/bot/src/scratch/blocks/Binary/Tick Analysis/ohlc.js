import config        from '../../../../constants/const';
import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Candles List'),
            message1: translate('with interval: %1'),
            args1   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate('Returns a list of 1000 candles'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Get candle list'),
            'description' : translate('This block returns the list of candles. Each candle has 4 properties: high, low, open, close, and open time.'),
        };
    },
};

Blockly.JavaScript.ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;

    const code = `Bot.getOhlc({ granularity: ${granularity} })`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
