import { localize } from '@deriv/translations';
import { minusIconDark } from '../images';

Blockly.Blocks.text_statement = {
    required_parent_type: 'text_join',
    init() {
        this.required_parent_id = '';
        const field_image = new Blockly.FieldImage(minusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('REMOVE_ICON').appendField(field_image);
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Text Statement'),
            description: '',
        };
    },
    onIconClick: Blockly.Blocks.lists_statement.onIconClick,
    onchange: Blockly.Blocks.lists_statement.onchange,
};

Blockly.JavaScript.text_statement = block => {
    const code = `String(${Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC)})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
