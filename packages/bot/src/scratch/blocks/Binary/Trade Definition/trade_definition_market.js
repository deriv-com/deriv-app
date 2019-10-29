import ApiHelpers from '../../../../services/api/api-helpers';

/* eslint-disable */
Blockly.Blocks.trade_definition_market = {
    init() {
        this.jsonInit({
            message0: 'Market: %1 > %2 > %3',
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'MARKET_LIST',
                    options: [['', '']],
                },
                {
                    type   : 'field_dropdown',
                    name   : 'SUBMARKET_LIST',
                    options: [['', '']],
                },
                {
                    type   : 'field_dropdown',
                    name   : 'SYMBOL_LIST',
                    options: [['', '']],
                },
            ],
            colour           : Blockly.Colours.Special1.colour,
            colourSecondary  : Blockly.Colours.Special1.colourSecondary,
            colourTertiary   : Blockly.Colours.Special1.colourTertiary,
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

        this.enforceLimitations();

        const { active_symbols } = ApiHelpers.instance;
        const market_field       = this.getField('MARKET_LIST');
        const submarket_field    = this.getField('SUBMARKET_LIST');
        const symbol_field       = this.getField('SYMBOL_LIST');
        const market             = market_field.getValue();
        const submarket          = submarket_field.getValue();
        const symbol             = symbol_field.getValue();

        if (
            (event.type === Blockly.Events.CREATE && event.ids.includes(this.id)) ||
            (event.type === Blockly.Events.END_DRAG && !market_field.menuGenerator_.length === 0)
        ) {
            active_symbols.getMarketDropdownOptions().then(market_options => {
                market_field.updateOptions(market_options, event.group, market, true, true);
            });
        } else if (event.type === Blockly.Events.END_DRAG) {
            const top_parent = this.getTopParent();

            if (event.blockId === top_parent.id) {
                const market_options = market_field.menuGenerator_; // eslint-disable-line

                if (market_options[0][0] === ''); {
                    // Trigger a create event to populate dropdowns.
                    Blockly.Events.fire(new Blockly.Events.Create(this));
                }
            }
        } else if (event.type === Blockly.Events.CHANGE) {
            if (event.name === 'MARKET_LIST') {
                active_symbols.getSubmarketDropdownOptions(market).then(submarket_options => {
                    submarket_field.updateOptions(submarket_options, event.group, submarket, true, true);
                });
            } else if (event.name === 'SUBMARKET_LIST') {
                active_symbols.getSymbolDropdownOptions(submarket).then(symbol_options => {
                    symbol_field.updateOptions(symbol_options, event.group, symbol, true, true);
                });
            }
        }
    },
    enforceLimitations() {
        if (!this.isDescendantOf('trade_definition')) {
            Blockly.Events.disable();

            this.unplug(false); // Unplug without reconnecting siblings

            const top_blocks = this.workspace.getTopBlocks();
            const trade_definition_block = top_blocks.find(block => block.type === 'trade_definition');

            // Reconnect self to trade definition block.
            if (trade_definition_block) {
                const connection = trade_definition_block.getLastConnectionInStatement('TRADE_OPTIONS');
                connection.connect(this.previousConnection);
            } else {
                this.dispose();
            }

            Blockly.Events.enable();
        }

        // These blocks cannot be disabled.
        if (this.disabled) {
            this.setDisabled(false);
        }
    },
};

Blockly.JavaScript.trade_definition_market = () => {};
