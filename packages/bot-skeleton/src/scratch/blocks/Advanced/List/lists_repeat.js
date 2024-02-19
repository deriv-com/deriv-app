import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../utils';

Blockly.Blocks.lists_repeat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('create list with item {{ input_item }} repeated {{ number }} times', {
                input_item: '%1',
                number: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'ITEM',
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                },
            ],
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Creates a list by repeating a given item'),
            category: Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Repeat an item'),
            description: localize('Creates a list with a given item repeated for a specific number of times.'),
        };
    },
    getRequiredValueInputs() {
        return {
            ITEM: emptyTextValidator,
            NUM: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.lists_repeat = block => {
    let codeSanitze = `function ${`listsRepeat`}(value, n) {
            var array = [];
            for (var i = 0; i < n; i++) {
                array[i] = value;
            }
            return array;
        }`;
    codeSanitze = codeSanitze.replace(/^\s+\n/, '');
    codeSanitze = codeSanitze.replace(/undefined/g, '');

    codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
    codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
    codeSanitze = codeSanitze.replace(/\s/g, '');
    codeSanitze = codeSanitze.replace(/function/, 'function ');
    codeSanitze = codeSanitze.replace(/return/, 'return ');
    codeSanitze = codeSanitze.replace(/var/, 'var ');
    // eslint-disable-next-line no-underscore-dangle
    const function_name = Blockly.JavaScript.provideFunction_('listsRepeat', [codeSanitze]);

    const element = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.Order.COMMA) || 'null';
    const repeat_count = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.Order.COMMA) || '0';
    const code = `${function_name}(${element}, ${repeat_count})`;

    return [code, Blockly.JavaScript.Order.FUNCTION_CALL];
};
