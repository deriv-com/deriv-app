// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#kqvz7z
import { translate } from '@i18n';
import config from '@currency-config';

Blockly.Blocks.balance = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Balance:'))
            .appendField(new Blockly.FieldDropdown(config.lists.BALANCE_TYPE), 'BALANCE_TYPE');
        this.setOutput(true, null);
        this.setColour('#dedede');
        this.setTooltip(translate('Get balance number or string'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
};
Blockly.JavaScript.balance = block => {
    const balanceType = block.getFieldValue('BALANCE_TYPE');
    return [`Bot.getBalance('${balanceType}')`, Blockly.JavaScript.ORDER_ATOMIC];
};
