import { localize } from '@deriv/translations';

Blockly.Blocks.trade_again = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Trade again'),
            message1: '%1',
            message2: '%1',
            args1: [
                {
                    type: 'input_dummy',
                },
            ],
            args2: [
                {
                    type: 'input_statement',
                    name: 'TRADEAGAIN_PARAMS',
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
};

Blockly.JavaScript.trade_again = block => {
    const blocks_in_tradeagain = block.getBlocksInStatement('TRADEAGAIN_PARAMS');
    let stop_loss, take_profit;
    if (blocks_in_tradeagain.length > 0) {
        stop_loss = block.childValueToCode('multiplier_stop_loss', 'AMOUNT');
        take_profit = block.childValueToCode('multiplier_take_profit', 'AMOUNT');
    }
    const code = `
    var profit = Bot.getProfitPerRun(false);
    if((profit < 0 && Math.abs(profit) >= ${stop_loss}) ||
    (profit >= 0 && profit >= ${take_profit})){
        Bot.isTradeAgain(false);\n
    }else{
        Bot.isTradeAgain(true);\n
    }
    return true;\n
    `;

    return code;
};
