import { localize }         from '@deriv/translations';
import { plusIconDark }     from '../images';
import { runGroupedEvents } from '../../utils';

Blockly.Blocks.text_join = {
    protected_statements: ['STACK'],
    allowed_children    : ['text_statement'],
    init() {
        const field_image = new Blockly.FieldImage(plusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('ADD_ICON').appendField(field_image);
        this.moveInputBefore('ADD_ICON', 'STACK');
    },
    definition(){
        return {
            message0: localize('set %1 to create text with'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: localize('text'),
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Text join'),
            category         : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Text join'),
            'description' : localize('Creates a single text string from combining the text value of each attached item, without spaces in between. The number of items can be added accordingly.'),
        };
    },
    onIconClick() {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        runGroupedEvents(false, () => {
            const text_block = this.workspace.newBlock('text_statement');
            text_block.required_parent_id = this.id;
            text_block.setMovable(false);
            text_block.initSvg();
            text_block.render();
    
            const shadow_block = this.workspace.newBlock('text');
            shadow_block.setShadow(true);
            shadow_block.setFieldValue('', 'TEXT');
            shadow_block.initSvg();
            shadow_block.render();
    
            const text_input = text_block.getInput('TEXT');
            text_input.connection.connect(shadow_block.outputConnection);
    
            const connection = this.getLastConnectionInStatement('STACK');
            connection.connect(text_block.previousConnection);
        });

        // TODO: Open editor and focus so user can add string right away?
        // const inputField = shadow_block.getField('TEXT');
        // inputField.showEditor_();
    },
    onchange: Blockly.Blocks.lists_create_with.onchange,
};

Blockly.JavaScript.text_join = Blockly.JavaScript.lists_create_with;
