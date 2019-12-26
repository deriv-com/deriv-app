import { localize } from 'deriv-translations';
import config       from '../../../../constants';

Blockly.Blocks.ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Candles List'),
            message1: localize('with interval: %1'),
            args1   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you a list of candles within a selected time interval.'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Get candle list'),
            'description' : localize('This block gives you a list of candles within a selected time interval.'),
        };
    },
};

Blockly.JavaScript.ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;

    const code = `Bot.getOhlc({ granularity: ${granularity} })`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
