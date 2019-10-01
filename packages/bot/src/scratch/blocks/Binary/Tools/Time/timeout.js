import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.timeout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('%1 %2 Run after %3 second(s)'),
            args0   : [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'TIMEOUTSTACK',
                },
                {
                    type: 'input_value',
                    name: 'SECONDS',
                },
            ],
            colour           : Blockly.Colours.Utility.colour,
            colourSecondary  : Blockly.Colours.Utility.colourSecondary,
            colourTertiary   : Blockly.Colours.Utility.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Run the blocks inside every n seconds'),
            category         : Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': translate('Run after a timeout'),
            'description' : translate('This block runs postpones execution of embedded instructions for X number of seconds. Actually, bot pauses execution of any other instructions until this block’s instructions are done.'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            const allowedScopes = [
                'trade_definition',
                'during_purchase',
                'before_purchase',
                'after_purchase',
                'tick_analysis',
            ];
            if (allowedScopes.some(scope => this.isDescendantOf(scope))) {
                if (this.disabled) {
                    this.setDisabled(false);
                }
            } else if (!this.disabled) {
                this.setDisabled(true);
            }
        }
    },
};

Blockly.JavaScript.timeout = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'TIMEOUTSTACK');
    const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC) || '1';

    const code = `sleep(${seconds});\n${stack}\n`;
    return code;
};
