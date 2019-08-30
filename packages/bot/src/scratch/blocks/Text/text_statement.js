import { minusIconDark } from '../images';
import { translate } from '../../../utils/tools';

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
            colour           : Blockly.Colours.BinaryLessGray.colour,
            colourSecondary  : Blockly.Colours.BinaryLessGray.colourSecondary,
            colourTertiary   : Blockly.Colours.BinaryLessGray.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Text Statement Tooltip'),
            category         : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text Statement'),
            'description' : translate('Text Statement Description'),
        };
    },
    onIconClick() {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        this.unplug(true);
        this.dispose();
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        const surroundParent = this.getSurroundParent();
        if (event.type === Blockly.Events.END_DRAG) {
            if (!this.requiredParentId && surroundParent.type === 'text_join') {
                this.requiredParentId = surroundParent.id;
            } else if (!surroundParent || surroundParent.id !== this.requiredParentId) {
                Blockly.Events.disable();
                this.unplug(false);

                const parentBlock = this.workspace.getAllBlocks().find(block => block.id === this.requiredParentId);

                if (parentBlock) {
                    const parentConnection = parentBlock.getLastConnectionInStatement('STACK');
                    parentConnection.connect(this.previousConnection);
                } else {
                    this.dispose();
                }
                Blockly.Events.enable();
            }
        }
    },
};

Blockly.JavaScript.text_statement = block => {
    const code = Blockly.JavaScript.valueToCode(block, 'TEXT') || '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
