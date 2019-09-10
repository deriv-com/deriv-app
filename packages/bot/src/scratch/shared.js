import filesaver                         from 'file-saver';
import { oppositesToDropdownOptions }    from './utils';
import config                            from '../constants';
import { translate }                     from '../utils/lang/i18n';

let purchase_choices = [[translate('Click to select'), '']];

export const saveAs = ({ data, filename, type }) => {
    const blob = new Blob([data], { type });
    filesaver.saveAs(blob, filename);
};

export const getPurchaseChoices = () => purchase_choices;

const getPurchaseDropdownOptions = (contract_type, opposite_name) => {
    const { [opposite_name]: trade_types } = config.opposites;
    let temp_purchase_choices = [];

    if (trade_types) {
        temp_purchase_choices.push(...trade_types.filter(trade_type => {
            return contract_type === 'both' || contract_type === Object.keys(trade_type)[0];
        }));
    }

    if (temp_purchase_choices.length === 0) {
        temp_purchase_choices = trade_types;
    }

    return oppositesToDropdownOptions(temp_purchase_choices);
};

export const updatePurchaseChoices = (contract_type, opposite_name) => {
    Blockly.Events.disable();

    purchase_choices = getPurchaseDropdownOptions(contract_type, opposite_name);

    const purchase_blocks = Blockly.derivWorkspace.getAllBlocks().filter(block => {
        return ['purchase', 'payout', 'ask_price'].includes(block.type);
    });

    purchase_blocks.forEach(purchase_block => {
        const purchase_list_field = purchase_block.getField('PURCHASE_LIST');
        const selected_value = purchase_list_field.getValue();

        purchase_list_field.updateOptions(purchase_choices, selected_value, false);
    });

    Blockly.Events.enable();
};

export const expectValue = (block, field) => {
    const value = Blockly.JavaScript.valueToCode(block, field, Blockly.JavaScript.ORDER_ATOMIC);
    if (!value) {
        throw Error(translate(`${field} cannot be empty`));
    }
    return value;
};
