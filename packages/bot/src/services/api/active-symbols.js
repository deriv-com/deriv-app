import PendingPromise from '../../utils/pending-promise';
import config         from '../../constants';

export default class ActiveSymbols {
    constructor(root_store, trading_times) {
        this.active_symbols      = [];
        this.disabled_markets    = [];
        this.disabled_symbols    = ['frxGBPNOK', 'frxUSDNOK', 'frxUSDNEK', 'frxUSDSEK']; // These are only forward-starting.
        this.disabled_submarkets = ['energy']; // These are only forward-starting.
        this.init_promise        = new PendingPromise();
        this.is_initialised      = false;
        this.processed_symbols   = {};
        this.trading_times       = trading_times;
        this.root_store          = root_store;
        this.ws                  = this.root_store.ws;
    }

    async retrieveActiveSymbols(is_forced_update = false) {
        await this.trading_times.initialise();

        if (!is_forced_update && this.is_initialised) {
            await this.init_promise;
            return this.active_symbols;
        }

        this.is_initialised = true;

        const { active_symbols } = await this.ws.activeSymbols();

        this.active_symbols = active_symbols;
        this.processed_symbols = this.processActiveSymbols();
        this.trading_times.onMarketOpenCloseChanged = (changes) => {
            Object.keys(changes).forEach(symbol_name => {
                const symbol_obj = this.active_symbols[symbol_name];

                if (symbol_obj) {
                    symbol_obj.exchange_is_open = changes[symbol_name];
                }
            });

            this.changes = changes;
            this.processActiveSymbols();
        };

        this.init_promise.resolve();

        return this.active_symbols;
    }

    processActiveSymbols() {
        return this.active_symbols.reduce((processed_symbols, symbol) => {
            if (
                this.disabled_markets.includes(symbol.market) ||
                this.disabled_symbols.includes(symbol.symbol) ||
                this.disabled_submarkets.includes(symbol.submarket)
            ) {
                return processed_symbols;
            }

            const isExistingValue = (object, prop) => Object.keys(object).findIndex(a => a === symbol[prop]) !== -1;

            if (!isExistingValue(processed_symbols, 'market')) {
                processed_symbols[symbol.market] = {
                    display_name: symbol.market_display_name,
                    submarkets  : {},
                };
            }

            const { submarkets } = processed_symbols[symbol.market];

            if (!isExistingValue(submarkets, 'submarket')) {
                submarkets[symbol.submarket] = {
                    display_name: symbol.submarket_display_name,
                    symbols     : {},
                };
            }

            const { symbols } = submarkets[symbol.submarket];

            if (!isExistingValue(symbols, 'symbol')) {
                symbols[symbol.symbol] = {
                    display_name: symbol.display_name,
                    pip_size    : `${symbol.pip}`.length - 2,
                    is_active   : (!symbol.is_trading_suspended && symbol.exchange_is_open),
                };
            }

            return processed_symbols;
        }, {});
    }

    async getAssetOptions() {
        await this.retrieveActiveSymbols();
        const all_market_options = {};

        Object.keys(this.processed_symbols).forEach(market_name => {
            const { submarkets } = this.processed_symbols[market_name];
            Object.keys(submarkets).forEach(key => {
                const submarket = submarkets[key];
                all_market_options[submarket.display_name] = this.getAllSymbolDropdownOptions(submarket);
            });
        });

        return (all_market_options.length === 0 ? config.NOT_AVAILABLE_DROPDOWN_OPTIONS : all_market_options);
    }

    // eslint-disable-next-line class-methods-use-this
    getAllSymbolDropdownOptions(submarket) {
        return Object.keys(submarket.symbols).map(key => {
            return {
                name : submarket.symbols[key].display_name,
                value: key,
            };
        });
    }

    async getMarketDropdownOptions() {
        await this.retrieveActiveSymbols();
        const market_options = [];

        Object.keys(this.processed_symbols).forEach(market_name => {
            const market = this.processed_symbols[market_name];
            market_options.push([market.display_name, market_name]);
        });

        return (market_options.length === 0 ? config.NOT_AVAILABLE_DROPDOWN_OPTIONS : market_options);
    }

    async getSubmarketDropdownOptions(market) {
        await this.retrieveActiveSymbols();

        const submarket_options = [];
        const market_obj        = this.processed_symbols[market];

        if (market_obj) {
            const { submarkets } = market_obj;

            Object.keys(submarkets).forEach(submarket_name => {
                submarket_options.push([submarkets[submarket_name].display_name, submarket_name]);
            });
        }

        return (submarket_options.length === 0 ? config.NOT_AVAILABLE_DROPDOWN_OPTIONS : submarket_options);
    }

    async getSymbolDropdownOptions(submarket) {
        await this.retrieveActiveSymbols();

        const symbol_options = Object.keys(this.processed_symbols).reduce((accumulator, market_name) => {
            const { submarkets } = this.processed_symbols[market_name];

            Object.keys(submarkets).forEach(submarket_name => {
                if (submarket_name === submarket) {
                    const { symbols } = submarkets[submarket_name];
                    Object.keys(symbols).forEach(symbol_name => {
                        accumulator.push([symbols[symbol_name].display_name, symbol_name]);
                    });
                }
            });

            return accumulator;
        }, []);

        return (symbol_options.length === 0 ? config.NOT_AVAILABLE_DROPDOWN_OPTIONS : symbol_options);
    }
}
