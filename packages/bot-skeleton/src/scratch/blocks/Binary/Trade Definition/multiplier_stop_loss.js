import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { config } from '../../../../constants/config';

Blockly.Blocks.multiplier_stop_loss = {
    init() {
        this.jsonInit(this.definition());
        this.setMovable(false);
        this.setDeletable(false);
    },
    definition() {
        return {
            message0: localize('Stop Loss: {{ currency }} {{ stop_loss }}', {
                currency: '%1',
                stop_loss: '%2',
            }),
            args0: [
                {
                    type: 'field_label',
                    name: 'CURRENCY_LIST',
                    text: getCurrencyDisplayCode(config.lists.CURRENCY[0]),
                },
                {
                    type: 'input_value',
                    name: 'AMOUNT',
                    check: 'Number',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Change variable'),
            description: localize('This block adds the given number to the selected variable.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }
        if (
            (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) ||
            event.type === Blockly.Events.END_DRAG
        ) {
            this.setCurrency();
        }
    },
    setCurrency: Blockly.Blocks.trade_definition_tradeoptions.setCurrency,
    getRequiredValueInputs() {
        const fieldInput = this.getInput('AMOUNT');
        if (fieldInput.connection.targetBlock()) {
            return {
                AMOUNT: input => {
                    const input_number = Number(input);
                    this.error_message = localize('Stop loss must be a positive number.');
                    const trade_definition_block = this.workspace.getTradeDefinitionBlock();
                    let stake_amount = 0;
                    if (trade_definition_block) {
                        const multiplier_block = trade_definition_block.getChildByType('trade_definition_multiplier');
                        stake_amount =
                            Number(
                                Blockly.JavaScript.valueToCode(
                                    multiplier_block,
                                    'AMOUNT',
                                    Blockly.JavaScript.ORDER_ATOMIC
                                )
                            ) || 0;
                        if (input_number > stake_amount) {
                            this.error_message = localize(
                                'Invalid stop loss. Stop loss cannot be more than {{ stake }}',
                                {
                                    stake: stake_amount,
                                }
                            );
                        }
                    }
                    return !isNaN(input_number) && (input_number <= 0 || input_number > stake_amount);
                },
            };
        }
        return {};
    },
};

Blockly.JavaScript.multiplier_stop_loss = () => {};
