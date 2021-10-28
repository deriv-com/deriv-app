import { localize } from '@deriv/translations';

Blockly.Blocks.trade_again = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Trade again {{ checked }} {{ stop_loss_label }} {{ stop_loss }}', {
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
                    name: 'SL_ENABLED',
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
                    name: 'TP_ENABLED',
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
    getRequiredValueInputs() {
        return {
            STOP_LOSS: input => {
                const input_number = Number(input);
                this.error_message = localize('Stop loss must be a positive number.');
                if (input === '') {
                    this.error_message = localize('Stop loss must have a value.');
                }
                return this.getFieldValue('SL_ENABLED') === 'TRUE' && !isNaN(input_number) && input_number <= 0;
            },
            TAKE_PROFIT: input => {
                const input_number = Number(input);
                this.error_message = localize('Take profit must be a positive number.');
                if (input === '') {
                    this.error_message = localize('Take profit must have a value.');
                }
                return this.getFieldValue('TP_ENABLED') === 'TRUE' && !isNaN(input_number) && input_number <= 0;
            },
        };
    },
    onchange(event) {
        if (event.type === Blockly.Events.BLOCK_CHANGE || event.type === Blockly.Events.BLOCK_CREATE) {
            if (this.getDescendants()[1]) {
                this.getDescendants()[1].setDisabled(this.getFieldValue('SL_ENABLED') !== 'TRUE');
            }
            if (this.getDescendants()[2]) {
                this.getDescendants()[2].setDisabled(this.getFieldValue('TP_ENABLED') !== 'TRUE');
            }
        }
    },
};

Blockly.JavaScript.trade_again = block => {
    const is_sl_enabled = block.getFieldValue('SL_ENABLED');
    const is_tp_enabled = block.getFieldValue('TP_ENABLED');
    const stop_loss = Blockly.JavaScript.valueToCode(block, 'STOP_LOSS', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    const take_profit = Blockly.JavaScript.valueToCode(block, 'TAKE_PROFIT', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    const code = `
    Bot.isTradeAgain(${is_sl_enabled === 'TRUE'}, ${is_tp_enabled === 'TRUE'}, ${stop_loss}, ${take_profit} );
    return true;\n
    `;

    return code;
};
