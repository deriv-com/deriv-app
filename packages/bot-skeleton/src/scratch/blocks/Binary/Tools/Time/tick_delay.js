import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.tick_delay = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ stack_input }} Run after {{ number }} tick(s)', {
                stack_input: '%1',
                number: '%2',
            }),
            args0: [
                {
                    type: 'input_statement',
                    name: 'TICKDELAYSTACK',
                },
                {
                    type: 'input_value',
                    name: 'TICKDELAYVALUE',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Run the blocks inside after a given number of ticks'),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Tick Delayed run'),
            description: localize(
                'This block delays execution for a given number of ticks. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.'
            ),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    getRequiredValueInputs() {
        return {
            TICKDELAYVALUE: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.tick_delay = block => {
    const stack = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'TICKDELAYSTACK');
    const ticks_value =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TICKDELAYVALUE',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '1';

    const code = `Bot.getDelayTickValue(${ticks_value})\n${stack}\n`;
    return code;
};
