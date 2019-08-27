import ApiHelpers from '../../../../services/api/helpers';

Blockly.Blocks.trade_definition_market = {
    init() {
        this.jsonInit({
            message0: 'Market: %1 Submarket: %2 Symbol: %3',
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
            colour           : Blockly.Colours.BinaryLessPurple.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.BinaryLessPurple.colourTertiary,
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

        if (event.type === Blockly.Events.CREATE && event.ids.includes(this.id)) {
            active_symbols.retrieveActiveSymbols().then(() => {
                const markets = active_symbols.getMarketDropdownOptions();
                market_field.updateOptions(markets, null, true);
            });
        } else if (event.type === Blockly.Events.CHANGE) {
            if (event.name === 'MARKET_LIST') {
                active_symbols.retrieveActiveSymbols().then(() => {
                    const submarkets = active_symbols.getSubmarketDropdownOptions(market_field.getValue());
                    submarket_field.updateOptions(submarkets, null, true);
                });
            } else if (event.name === 'SUBMARKET_LIST') {
                const symbol_field = this.getField('SYMBOL_LIST');

                active_symbols.retrieveActiveSymbols().then(() => {
                    const symbols = active_symbols.getSymbolDropdownOptions(submarket_field.getValue());
                    symbol_field.updateOptions(symbols, null, true);
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
