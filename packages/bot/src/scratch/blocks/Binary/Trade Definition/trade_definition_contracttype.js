import { localize } from 'deriv-translations/lib/translate';
import config       from '../../../../constants';

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

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.updateContractTypes(event.group);
        } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
            if (event.name === 'TRADETYPE_LIST' && !['', 'na'].includes(event.newValue)) {
                this.updateContractTypes(event.group);
            }
        }
    },
    updateContractTypes(event_group) {
        const top_parent_block    = this.getTopParent();
        const trade_type_block    = top_parent_block.getChildByType('trade_definition_tradetype');
        const trade_type          = trade_type_block.getFieldValue('TRADETYPE_LIST');
        const contract_type_field = this.getField('TYPE_LIST');
        const contract_type       = contract_type_field.getValue();

        let contract_types;

        if (trade_type && trade_type !== 'na') {
            const { opposites } = config;
            contract_types      = [
                [localize('Both'), 'both'],
                ...opposites[trade_type.toUpperCase()].map(type => Object.entries(type)[0].reverse()),
            ];
        } else {
            contract_types = config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
        }

        contract_type_field.updateOptions(contract_types, event_group, contract_type);
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
};
Blockly.JavaScript.trade_definition_contracttype = () => '';
