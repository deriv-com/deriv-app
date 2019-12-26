import { localize }      from 'deriv-translations';
import { minusIconDark } from '../images';

Blockly.Blocks.text_statement = {
    init() {
        this.requiredParentId = '';

        this.jsonInit(this.definition());

        const fieldImage = new Blockly.FieldImage(minusIconDark, 25, 25, '', () => this.onIconClick());

        this.appendDummyInput('REMOVE_ICON').appendField(fieldImage);
    },
    definition(){
        return {
            message0: '%1',
            args0   : [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Text string'),
            category         : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Text Statement'),
            'description' : localize('Text Statement Description'),
        };
    },
    onIconClick() {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        this.unplug(true);
        this.dispose();
    },
    onchange            : Blockly.Blocks.lists_statement.onchange,
    required_parent_type: 'text_join',
};

Blockly.JavaScript.text_statement = block => {
    const code = `String(${Blockly.JavaScript.valueToCode(block, 'TEXT')})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
