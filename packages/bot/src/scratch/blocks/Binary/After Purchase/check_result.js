import config        from '../../../../constants';
import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.contract_check_result = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('Result is %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CHECK_RESULT',
                    options: config.lists.CHECK_RESULT,
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('True if the result of the last trade matches the selection'),
            category       : Blockly.Categories.After_Purchase,
        };
    },
    meta(){
        return {
            'display_name': translate('Last trade result'),
            'description' : translate('This block checks the result of the last trade.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.END_DRAG) {
            const top_parent = this.getTopParent();

            if (top_parent) {
                const is_illegal_root_block = top_parent.isMainBlock() && top_parent.type !== 'after_purchase';

                if (is_illegal_root_block) {
                    this.setDisabled(true);
                }
            }
        }
    },
};

Blockly.JavaScript.contract_check_result = block => {
    const checkWith = block.getFieldValue('CHECK_RESULT');

    const code = `Bot.isResult('${checkWith}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
