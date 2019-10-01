import config        from '../../../../../constants';
import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.read_ohlc_obj = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Read %1 value in candle %2'),
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
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate('Read the selected candle value'),
            category       : Blockly.Categories.Candle,
        };
    },
    meta(){
        return {
            'display_name': translate('Read candle value (2)'),
            'description' : translate('This block reads selected value from a candle. '),
        };
    },
};

Blockly.JavaScript.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj = Blockly.JavaScript.valueToCode(block, 'OHLCOBJ') || '{}';

    const code = `Bot.candleField(${ohlcObj}, '${ohlcField}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
