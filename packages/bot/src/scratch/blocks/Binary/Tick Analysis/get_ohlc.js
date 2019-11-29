import { localize } from 'deriv-translations';
import config       from '../../../../constants';

Blockly.Blocks.get_ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('in candle list get # from end %1'),
            message1: localize('with interval: %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'CANDLEINDEX',
                    check: 'Number',
                },
            ],
            args1: [
                {
                    type   : 'field_dropdown',
                    name   : 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output         : 'Candle',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you a specific candle from within the selected time interval.'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Get candle'),
            'description' : localize('This block gives you a specific candle from within the selected time interval.'),
        };
    },
};

Blockly.JavaScript.get_ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;
    const index = Blockly.JavaScript.valueToCode(block, 'CANDLEINDEX', Blockly.JavaScript.ORDER_ATOMIC) || '1';

    const code = `Bot.getOhlcFromEnd({ index: ${index}, granularity: ${granularity} })`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
