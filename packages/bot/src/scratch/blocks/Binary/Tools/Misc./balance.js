import { localize } from 'deriv-translations/lib/i18n';
import config       from '../../../../../constants';

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
            message0: localize('Balance: %1'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'BALANCE_TYPE',
                    options: config.lists.BALANCE_TYPE,
                },
            ],
            output         : null,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block returns current account balance'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': localize('Balance'),
            'description' : localize('This block returns current account balance.'),
        };
    },
};

Blockly.JavaScript.balance = block => {
    const balanceType = block.getFieldValue('BALANCE_TYPE');

    const code = `Bot.getBalance('${balanceType}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
