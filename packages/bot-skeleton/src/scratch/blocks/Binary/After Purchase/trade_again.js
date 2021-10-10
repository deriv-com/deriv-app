import { localize } from '@deriv/translations';

Blockly.Blocks.trade_again = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Trade Again {{ checked }} {{ stop_loss_label }} {{ stop_loss }}', {
                checked: '%1',
                stop_loss_label: '%2',
                stop_loss: '%3',
            }),
            message1: localize('{{ checked }} {{ take_profit_label }} {{ take_profit }}', {
                checked: '%1',
                take_profit_label: '%2',
                take_profit: '%3',
            }),
            args0: [
                {
                    type: 'field_image_checkbox',
                    name: 'SL_ENABALED',
                    checked: false,
                },
                {
                    type: 'field_label',
                    name: 'SL_LABEL',
                    text: 'Until stop loss is:',
                },
                {
                    type: 'input_value',
                    name: 'STOP_LOSS',
                },
            ],
            args1: [
                {
                    type: 'field_image_checkbox',
                    name: 'TP_ENABALED',
                    checked: false,
                },
                {
                    type: 'field_label',
                    name: 'TP_LABEL',
                    text: 'Until take profit is:',
                },
                {
                    type: 'input_value',
                    name: 'TAKE_PROFIT',
                },
            ],

            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            tooltip: localize('These blocks transfer control to the Purchase conditions block.'),
            category: Blockly.Categories.After_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Trade again'),
            description: localize(
                'This block will transfer the control back to the Purchase conditions block, enabling you to purchase another contract.'
            ),
            key_words: localize('restart'),
        };
    },
    restricted_parents: ['after_purchase'],
    // onchange(event) {
    //     const trade_again_block = this.workspace.getTradeAgainBlock();
    //     console.log('this', this);
    //     console.log('trade again block:', trade_again_block);
    //     if (event.type === Blockly.Events.BLOCK_CHANGE) {
    //         const SL_ENABALED = this.getFieldValue('SL_ENABALED');
    //         let cc = trade_again_block.getDescendants();
    //         console.log('cccc: ', cc);
    //     }
    // },
};

Blockly.JavaScript.trade_again = block => {
    block.error_message = 'ksjdkasjhdkajshd';
    const is_sl_enabled = block.getFieldValue('SL_ENABALED').toLowerCase();
    const is_tp_enabled = block.getFieldValue('TP_ENABALED').toLowerCase();

    const stop_loss = Blockly.JavaScript.valueToCode(block, 'STOP_LOSS', Blockly.JavaScript.ORDER_ATOMIC);
    const take_profit = Blockly.JavaScript.valueToCode(block, 'TAKE_PROFIT', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `
    var profit = Bot.getProfitPerRun(false);
    if((${is_sl_enabled} && profit < 0 && Math.abs(profit) >= ${stop_loss}) ||
    (${is_tp_enabled} && profit >= 0 && profit >= ${take_profit})){
        var total_run = Bot.getRuns();
        var message = (profit < 0 ? 'Stop loss' : 'Take profit') + ' is set to ' + (profit < 0 ?  ${stop_loss} : ${take_profit}) + '. PL after ' + total_run + ' runs is ' +  profit + '. Bot has stopped.';
        Bot.emitError(message);
        Bot.isTradeAgain(false);\n
    }else{
        Bot.isTradeAgain(true);\n
    }

    return true;\n
    `;

    return code;
};
