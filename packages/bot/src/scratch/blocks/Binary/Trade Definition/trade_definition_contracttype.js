import { localize }               from 'deriv-translations/lib/i18n';
import config                     from '../../../../constants';
import { getContractTypeOptions } from '../../../shared';

Blockly.Blocks.trade_definition_contracttype = {
    init() {
        this.jsonInit({
            message0: 'Contract Type: %1',
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'TYPE_LIST',
                    options: [['', '']],
                },
            ],
            colour           : Blockly.Colours.Special1.colour,
            colourSecondary  : Blockly.Colours.Special1.colourSecondary,
            colourTertiary   : Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
        });
        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();

        if (Blockly.Events.BLOCK_CHANGE) {
            if (event.name === 'TRADETYPE_LIST') {
                const trade_type            = event.newValue;
                const contract_type_list    = this.getField('TYPE_LIST');
                const contract_type_options = [];

                const trade_types = getContractTypeOptions('both', trade_type);
                
                if (trade_types.length > 1) {
                    contract_type_options.push([translate('Both'), 'both']);
                }

<<<<<<< HEAD
        if (trade_type && trade_type !== 'na') {
            const { opposites } = config;
            contract_types      = [
                [localize('Both'), 'both'],
                ...opposites[trade_type.toUpperCase()].map(type => Object.entries(type)[0].reverse()),
            ];
        } else {
            contract_types = config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
        }
=======
                contract_type_options.push(...trade_types);
>>>>>>> 20fd5696d7d284d7d6fe372c5a89101a59bdcfd5

                if (contract_type_options.length === 0) {
                    contract_type_options.push(...config.NOT_AVAILABLE_DROPDOWN_OPTIONS);
                }

                contract_type_list.updateOptions(contract_type_options, { event_group: event.group });
            }
        }
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
};
Blockly.JavaScript.trade_definition_contracttype = () => '';
