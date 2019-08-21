import filesaver                         from 'file-saver';
import { oppositesToDropdown }           from './utils';
import config                            from '../constants/const';
import { translate }                     from '../utils/lang/i18n';

let purchaseChoices = [[translate('Click to select'), '']];

export const saveAs = ({ data, filename, type }) => {
    const blob = new Blob([data], { type });
    filesaver.saveAs(blob, filename);
};

export const getPurchaseChoices = () => purchaseChoices;

const filterPurchaseChoices = (contractType, oppositesName) => {
    const { [oppositesName]: tradeTypes } = config.opposites;

    let tmpPurchaseChoices = tradeTypes.filter(k =>
        contractType === 'both' ? true : contractType === Object.keys(k)[0]
    );

    if (!tmpPurchaseChoices.length) {
        tmpPurchaseChoices = tradeTypes;
    }
    return oppositesToDropdown(tmpPurchaseChoices);
};

export const updatePurchaseChoices = (contractType, oppositesName) => {
    purchaseChoices = filterPurchaseChoices(contractType, oppositesName);
    const purchases = Blockly.mainWorkspace
        .getAllBlocks()
        .filter(r => ['purchase', 'payout', 'ask_price'].indexOf(r.type) >= 0);
    Blockly.Events.recordUndo = false;
    purchases.forEach(purchase => {
        const value = purchase.getField('PURCHASE_LIST').getValue();
        Blockly.WidgetDiv.hideIfOwner(purchase.getField('PURCHASE_LIST'));
        if (value === purchaseChoices[0][1]) {
            purchase.getField('PURCHASE_LIST').setText(purchaseChoices[0][0]);
        } else if (purchaseChoices.length === 2 && value === purchaseChoices[1][1]) {
            purchase.getField('PURCHASE_LIST').setText(purchaseChoices[1][0]);
        } else {
            purchase.getField('PURCHASE_LIST').setValue(purchaseChoices[0][1]);
            purchase.getField('PURCHASE_LIST').setText(purchaseChoices[0][0]);
        }
    });
    Blockly.Events.recordUndo = true;
};

export const expectValue = (block, field) => {
    const value = Blockly.JavaScript.valueToCode(block, field, Blockly.JavaScript.ORDER_ATOMIC);
    if (!value) {
        throw Error(translate(`${field} cannot be empty`));
    }
    return value;
};
