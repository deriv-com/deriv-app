import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.tick = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Last Tick'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the tick value received by a before purchase block'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Tick value'),
            'description' : translate('Tick value Description'),
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

Blockly.JavaScript.tick = () => ['Bot.getLastTick()', Blockly.JavaScript.ORDER_ATOMIC];
