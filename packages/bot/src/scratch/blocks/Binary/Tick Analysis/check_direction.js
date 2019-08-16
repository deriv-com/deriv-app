import config        from '../../../../constants/const';
import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.check_direction = {
    init() {
        this.jsonInit({
            message0: translate('Direction is %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CHECK_DIRECTION',
                    options: config.lists.CHECK_DIRECTION,
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('True if the direction matches the selection'),
        });
    },
};

Blockly.JavaScript.check_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');

    const code = `Bot.checkDirection('${checkWith}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
