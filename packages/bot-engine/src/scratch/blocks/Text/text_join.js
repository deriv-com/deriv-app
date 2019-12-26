import { localize }     from 'deriv-translations';
import { plusIconDark } from '../images';

Blockly.Blocks.text_join = {
    protected_statements: ['STACK'],
    init() {
        this.jsonInit(this.definition());

        const fieldImage = new Blockly.FieldImage(plusIconDark, 25, 25, '', this.onIconClick.bind(this));

        this.appendDummyInput('ADD_ICON').appendField(fieldImage);
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

        Blockly.Events.setGroup(true);

        const textBlock = this.workspace.newBlock('text_statement');
        textBlock.requiredParentId = this.id;
        textBlock.setMovable(false);
        textBlock.initSvg();
        textBlock.render();

        const shadowBlock = this.workspace.newBlock('text');
        shadowBlock.setShadow(true);
        shadowBlock.setFieldValue('', 'TEXT');
        shadowBlock.initSvg();
        shadowBlock.render();

        const textInput = textBlock.getInput('TEXT');
        textInput.connection.connect(shadowBlock.outputConnection);

        const connection = this.getLastConnectionInStatement('STACK');
        connection.connect(textBlock.previousConnection);

        Blockly.Events.setGroup(false);

        // TODO: Open editor and focus so user can add string right away?
        // const inputField = shadowBlock.getField('TEXT');
        // inputField.showEditor_();
    },
    enforceTextStatementType() {
        let currentBlock = this.getInputTargetBlock('STACK');

        while (currentBlock !== null) {
            if (currentBlock.type !== 'text_statement') {
                currentBlock.unplug(false);
            }
            currentBlock = currentBlock.getNextBlock();
        }
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            // Only allow `text_statement` type blocks
            const blocksInStatement = this.getBlocksInStatement('STACK');
            blocksInStatement.forEach(block => {
                if (block.type !== 'text_statement') {
                    Blockly.Events.disable();
                    block.unplug();
                    Blockly.Events.enable();
                }
            });
        }
    },
};

Blockly.JavaScript.text_join = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );

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

    let code;

    if (elements.length === 0) {
        code = `${varName} = '';\n`;
    } else {
        code = `${varName} = ${elements.join(' + ')};\n`;
    }

    return code;
};
