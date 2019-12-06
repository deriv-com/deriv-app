import { localize } from 'deriv-translations';

Blockly.Blocks.timeout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('%1 %2 Run after %3 second(s)'),
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
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Run the blocks inside after a given number of seconds'),
            category         : Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': localize('Delayed run'),
            'description' : localize('This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.'),
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
