import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.sell_price = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Sell profit/loss'),
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the profit/loss from selling at market price'),
            category: Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Profit/loss from selling'),
            description: localize(
                'This block gives you the potential profit or loss if you decide to sell your contract.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    restricted_parents: ['during_purchase'],
};

Blockly.JavaScript.javascriptGenerator.forBlock.sell_price = () => {
    const code = 'Bot.getSellPrice()';
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
