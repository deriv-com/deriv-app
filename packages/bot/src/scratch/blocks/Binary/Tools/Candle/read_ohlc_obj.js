import { localize } from 'deriv-translations';
import config       from '../../../../../constants';

Blockly.Blocks.read_ohlc_obj = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Read %1 value in candle %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'OHLCFIELD_LIST',
                    options: config.ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'OHLCOBJ',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you the selected candle value.'),
            category       : Blockly.Categories.Candle,
        };
    },
    meta(){
        return {
            'display_name': localize('Read candle value (2)'),
            'description' : localize('This block gives you the selected candle value.'),
        };
    },
};

Blockly.JavaScript.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj = Blockly.JavaScript.valueToCode(block, 'OHLCOBJ') || '{}';

    const code = `Bot.candleField(${ohlcObj}, '${ohlcField}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
