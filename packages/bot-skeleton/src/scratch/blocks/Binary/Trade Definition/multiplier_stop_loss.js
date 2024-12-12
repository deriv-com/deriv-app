import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { config } from '../../../../constants/config';
import { modifyContextMenu, setCurrency } from '../../../utils';

const description = localize(
    'Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.'
);

Blockly.Blocks.multiplier_stop_loss = {
    init() {
        this.jsonInit(this.definition());
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
            tooltip: description,
            category: Blockly.Categories.Trade_Definition,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    meta() {
        return {
            display_name: localize('Stop loss (Multiplier)'),
            description,
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyoutVisible || this.workspace.isDragging()) {
            return;
        }
        if (
            (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) ||
            (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart)
        ) {
            setCurrency(this);
        }
    },
    restricted_parents: ['trade_definition_multiplier'],
    getRequiredValueInputs() {
        const field_input = this.getInput('AMOUNT');
        if (field_input.connection.targetBlock()) {
            return {
                AMOUNT: input => {
                    const input_number = Number(input);
                    this.error_message = localize('Stop loss must be a positive number.');
                    return !isNaN(input_number) && input_number <= 0;
                },
            };
        }
        return {};
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.multiplier_stop_loss = () => {};
