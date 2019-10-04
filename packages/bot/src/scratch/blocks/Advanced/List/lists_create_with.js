import { plusIconDark } from '../../images';
import { translate }    from '../../../../utils/lang/i18n';

Blockly.Blocks.lists_create_with = {
    init() {
        this.jsonInit(this.definition());

        // Render a ➕-icon for adding additional `lists_statement` blocks
        const fieldImage = new Blockly.FieldImage(plusIconDark, 25, 25, '', () => this.onIconClick());
        this.appendDummyInput('ADD_ICON').appendField(fieldImage);
        this.moveInputBefore('ADD_ICON', 'STACK');
    },
    definition(){
        return {
            message0: translate('set %1 to create list with'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: translate('list'),
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            colour           : Blockly.Colours.Utility.colour,
            colourSecondary  : Blockly.Colours.Utility.colourSecondary,
            colourTertiary   : Blockly.Colours.Utility.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Create List'),
            category         : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': translate('Create list'),
            'description' : translate('This block creates list with provided strings and/or numbers.'),
        };
    },
    onIconClick() {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        const statementBlock = this.workspace.newBlock('lists_statement');
        statementBlock.requiredParentId = this.id;
        statementBlock.setMovable(false);
        statementBlock.initSvg();
        statementBlock.render();

        const connection = this.getLastConnectionInStatement('STACK');
        connection.connect(statementBlock.previousConnection);
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            // Only allow `lists_statement` blocks to be part of the `STACK`
            let currentBlock = this.getInputTargetBlock('STACK');
            while (currentBlock !== null) {
                if (currentBlock.type !== 'lists_statement') {
                    currentBlock.unplug(false);
                }
                currentBlock = currentBlock.getNextBlock();
            }
        }
    },
};

Blockly.JavaScript.lists_create_with = block => {
    const variable = block.getFieldValue('VARIABLE');
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(variable, Blockly.Variables.NAME_TYPE);
    const elements = [];

    let currentBlock = block.getInputTargetBlock('STACK');
    while (currentBlock !== null) {
        const value = Blockly.JavaScript[currentBlock.type](currentBlock);

        if (Array.isArray(value) && value.length === 2) {
            elements.push(value[0]);
        } else {
            elements.push(value);
        }

        currentBlock = currentBlock.getNextBlock();
    }

    const code = `${varName} = [${elements.join(', ')}];\n`;
    return code;
};
