import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.input_list = {
    init() {
        this.jsonInit({
            message0: translate('Input List %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'INPUT_LIST',
                    check: 'Array',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.END_DRAG) {
            const surround_parent = this.getSurroundParent();

            if (
                surround_parent
                && !this.required_parent_id
                && this.allowed_parents.includes(surround_parent.type)
            ) {
                this.required_parent_id = surround_parent.id;
            } else if (!surround_parent || surround_parent.type !== this.required_parent_id) {
                Blockly.Events.disable();
                this.unplug(true);

                const parent_block = this.workspace.getAllBlocks(true).find(block =>
                    block.id === this.required_parent_id
                );

                if (parent_block) {
                    const parent_connection = parent_block.getLastConnectionInStatement('STATEMENT');
                    parent_connection.connect(this.previousConnection);
                } else {
                    this.dispose();
                }

                Blockly.Events.enable();
            }
        }
    },
    allowed_parents: [
        'bb_statement',
        'bba_statement',
        'ema_statement',
        'emaa_statement',
        'macda_statement',
        'rsi_statement',
        'rsia_statement',
        'sma_statement',
        'smaa_statement',
    ],
};

Blockly.JavaScript.input_list = () => {};
