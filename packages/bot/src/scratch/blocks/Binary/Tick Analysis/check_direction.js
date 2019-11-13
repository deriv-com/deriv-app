import config        from '../../../../constants';
import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.check_direction = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Direction is %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CHECK_DIRECTION',
                    options: config.lists.CHECK_DIRECTION,
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('True if the market direction matches the selection'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Market direction'),
            'description' : translate('This block is used to determine if the market price moves in the selected direction or not. It gives you a value of “True” or “False”.'),
        };
    },
};

Blockly.JavaScript.check_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');

    const code = `Bot.checkDirection('${checkWith}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
