import { localize } from 'deriv-translations';

Blockly.Blocks.is_candle_black = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Is candle black? %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'OHLCOBJ',
                    check: 'Candle',
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize(
                'Returns "True" if the given candle is black'
            ),
            category: Blockly.Categories.Candle,
        };
    },
    meta(){
        return {
            'display_name': localize('Is candle black?'),
            'description' : localize('This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.'),
        };
    },
};

Blockly.JavaScript.is_candle_black = block => {
    const ohlcObj = Blockly.JavaScript.valueToCode(block, 'OHLCOBJ') || '{}';

    const code = `Bot.isCandleBlack(${ohlcObj})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
