import config        from '../../../../../constants';
import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.balance = {
    init() {
        this.jsonInit(this.definition());

        // Change shape based on selected type
        const balanceTypeField = this.getField('BALANCE_TYPE');
        balanceTypeField.setValidator(value => {
            if (value === 'STR') {
                this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE);
                this.setOutput(true, 'String');
            } else if (value === 'NUM') {
                this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
                this.setOutput(true, 'Number');
            }
            this.initSvg();
            this.render(false);
            return undefined;
        });
    },
    definition(){
        return {
            message0: translate('Balance: %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'BALANCE_TYPE',
                    options: config.lists.BALANCE_TYPE,
                },
            ],
            output         : null,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('This block returns current account balance'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Balance'),
            'description' : translate('This block returns current account balance.'),
        };
    },
};

Blockly.JavaScript.balance = block => {
    const balanceType = block.getFieldValue('BALANCE_TYPE');

    const code = `Bot.getBalance('${balanceType}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
