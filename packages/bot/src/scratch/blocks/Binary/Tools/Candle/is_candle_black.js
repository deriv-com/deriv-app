import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.is_candle_black = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Is candle black? %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'OHLCOBJ',
                    check: 'Candle',
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate(
                'Returns "True" if the given candle is black'
            ),
            category: Blockly.Categories.Candle,
        };
    },
    meta(){
        return {
            'display_name': translate('Is Candle Black?'),
            'description' : translate('This block returns “True” in case the last candle was black. You can place this block anywhere except for the first root block (Trade Parameters).'),
        };
    },
};

Blockly.JavaScript.is_candle_black = block => {
    const ohlcObj = Blockly.JavaScript.valueToCode(block, 'OHLCOBJ') || '{}';

    const code = `Bot.isCandleBlack(${ohlcObj})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
