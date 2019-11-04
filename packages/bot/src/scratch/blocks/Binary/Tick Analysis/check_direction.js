import { localize } from 'deriv-translations/lib/i18n';
import config       from '../../../../constants';

Blockly.Blocks.check_direction = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('Direction is %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CHECK_DIRECTION',
                    options: config.lists.CHECK_DIRECTION,
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('True if the market direction matches the selection'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Market direction'),
            'description' : localize('This block returns “True” in case if market price goes in the selected direction since the last tick. '),
        };
    },
};

Blockly.JavaScript.check_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');

    const code = `Bot.checkDirection('${checkWith}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
