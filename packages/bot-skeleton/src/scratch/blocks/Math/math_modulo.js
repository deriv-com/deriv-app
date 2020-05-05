import { localize } from '@deriv/translations';

Blockly.Blocks.math_modulo = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('remainder of %1 ÷ %2'),
            args0: [
                {
                    type: 'input_value',
                    name: 'DIVIDEND',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'DIVISOR',
                    check: 'Number',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the remainder after a division'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Remainder after division'),
            description: localize(' Returns the remainder after the division of the given numbers.'),
        };
    },
    getRequiredValueInputs() {
        return {
            DIVIDEND: null,
            DIVISOR: null,
        };
    },
};

Blockly.JavaScript.math_modulo = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', Blockly.JavaScript.ORDER_MODULUS) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'DIVISOR', Blockly.JavaScript.ORDER_MODULUS) || '0';
    const functionName = Blockly.JavaScript.provideFunction_('mathModulo', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(a, b) {
        if (b === 0) {
            return ${block.parentBlock_.type === 'notify'} ? NaN : Bot.notify({ message: NaN, block_id: '${
            block.id
        }' });
        } else {
            return a % b;
        }
    }`,
    ]);

    const code = `${functionName}(${argument0}, ${argument1})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
