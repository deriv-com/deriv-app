import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_single = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        [localize('square root'), 'ROOT'],
                        [localize('absolute'), 'ABS'],
                        ['-', 'NEG'],
                        ['ln', 'LN'],
                        ['log10', 'LOG10'],
                        ['e^', 'EXP'],
                        ['10^', 'POW10'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Operations on a given number'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Operations on a given number'),
            description: localize('This block performs the selected operations to a given number.'),
        };
    },
    getRequiredValueInputs() {
        return {
            NUM: null,
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_single = block => {
    const operator = block.getFieldValue('OP');

    let code, arg;

    if (operator === 'NEG') {
        // Negation is a special case given its different operator precedence.
        arg =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'NUM',
                Blockly.JavaScript.javascriptGenerator.ORDER_UNARY_NEGATION
            ) || '0';
        if (arg[0] === '-') {
            // --3 is not legal in JS
            arg = ` ${arg}`;
        }
        code = `-${arg}`;
        return [code, Blockly.JavaScript.javascriptGenerator.ORDER_UNARY_NEGATION];
    }

    if (['SIN', 'COS', 'TAN'].includes(operator)) {
        arg =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'NUM',
                Blockly.JavaScript.javascriptGenerator.ORDER_DIVISION
            ) || '0';
    } else {
        arg =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'NUM',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '0';
    }

    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    if (operator === 'ABS') {
        code = `Math.abs(${arg})`;
    } else if (operator === 'ROOT') {
        code = `Math.sqrt(${arg})`;
    } else if (operator === 'LN') {
        code = `Math.log(${arg})`;
    } else if (operator === 'EXP') {
        code = `Math.pow(Math.E, ${arg})`;
    } else if (operator === 'POW10') {
        code = `Math.pow(10, ${arg})`;
    } else if (operator === 'ROUND') {
        code = `Math.round(${arg})`;
    } else if (operator === 'ROUNDUP') {
        code = `Math.ceil(${arg})`;
    } else if (operator === 'ROUNDDOWN') {
        code = `Math.floor(${arg})`;
    } else if (operator === 'SIN') {
        code = `Math.sin(${arg} / 180 * Math.PI)`;
    } else if (operator === 'COS') {
        code = `Math.cos(${arg} / 180 * Math.PI)`;
    } else if (operator === 'TAN') {
        code = `Math.tan(${arg} / 180 * Math.PI)`;
    }

    if (code) {
        return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
    }

    // Second, handle cases which generate values that may need parentheses
    // wrapping the code.
    if (operator === 'LOG10') {
        code = `Math.log(${arg}) / Math.log(10)`;
    } else if (operator === 'ASIN') {
        code = `Math.asin(${arg}) / Math.PI * 180`;
    } else if (operator === 'ACOS') {
        code = `Math.acos(${arg}) / Math.PI * 180`;
    } else if (operator === 'ATAN') {
        code = `Math.atan(${arg}) / Math.PI * 180`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_DIVISION];
};
