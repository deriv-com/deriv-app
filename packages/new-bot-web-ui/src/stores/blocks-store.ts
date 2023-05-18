import { computed, observable, action, makeObservable, runInAction } from 'mobx';
// import config_data from '../strategies/default.json';
import { getSetting, storeSetting } from 'Utils/settings';
import RootStore from './root-store';
import GTM from 'Utils/gtm';
import {
    TMarket,
    TMarketDropdown,
    TMarketOption,
    TDropdowns,
    TSelectedValuesSelect,
    TQSCache,
} from '../components/blocks/blocks.types';
// import {ApiHelpers, ActiveSymbols} from 'Services/api';
import {config} from '../constants/config-blocks';
import { localize } from '@deriv/translations';
import ApiHelpers from '../services/api/api-helpers';
import ActiveSymbols from '../services/api/active-symbols';

export default class BlocksStore {
    root_store: RootStore;
    qs_cache: TQSCache = (getSetting('strategy') as TQSCache) || {};

    constructor(root_store: RootStore) {
        makeObservable(this, {
            selected_market: observable,
            selected_submarket: observable,
            selected_symbol: observable,
            initial_values: computed,
            markets_dropdown: observable,
            submarkets_dropdown: observable,
            symbols_dropdown: observable,
            setMarketsDropdown: action.bound,
            setSelectedMarket: action.bound,
            setSelectedSubmarket: action.bound,
            setSelectedSymbol: action.bound,
            getFieldMap: action.bound,
            onHideDropdownList: action.bound,
            loadDataStrategy: action.bound,
            updateMarketsDropdown: action.bound,
            processed_symbols: observable,
            active_symbols: observable,
            onChangeDropdownItem: action.bound,
            onScrollStopDropdownList: action.bound,
        });

        this.root_store = root_store;
    }

    selected_market: TMarket = (this.qs_cache.selected_market as TMarket) || {};
    selected_submarket: any = (this.qs_cache.selected_submarket) || {};
    selected_symbol: TMarketOption = (this.qs_cache.selected_symbol as TMarketOption) || {};
    markets_dropdown: TMarketDropdown = [];
    submarkets_dropdown: TMarketDropdown = [];
    symbols_dropdown: any = [];
    processed_symbols: any = {};
    active_symbols = [];
    disabled_markets = [];
    disabled_symbols = ['frxGBPNOK', 'frxUSDNOK', 'frxUSDNEK', 'frxUSDSEK']; // These are only forward-starting.
    disabled_submarkets = ['energy', 'step_index', 'crash_index'];
    is_initialised: boolean = false;

    get initial_values() {
        const init = {
            'bot-builder__market': this.getFieldValue(this.markets_dropdown, this.selected_market.value) || '',
            'bot-builder__submarket': this.getFieldValue(this.submarkets_dropdown, this.selected_submarket.value) || '',
            'bot-builder__symbol': this.getFieldValue(this.symbols_dropdown, this.selected_symbol.value) || '',
        };
        storeSetting('strategy', this.qs_cache);
        
        return init;
    }

    setMarketsDropdown(markets: TMarketOption): void {
        console.log('setMarketsDropdown markets', markets);
        
        this.markets_dropdown = markets;
    }

    setSubmarketsDropdown(submarkets): void {
        console.log('setSubmarketsDropdown submarkets', submarkets);
        this.submarkets_dropdown = submarkets;
    }

    setSymbolsDropdown(symbols): void {
        console.log('setSymbolsDropdown symbols', symbols);
        this.symbols_dropdown = symbols;
    }

    setSelectedMarket(market): void {
        console.log('setSelectedMarket market: ', market);
        this.qs_cache.selected_market = market;
        this.selected_market = market;
        // delete this.qs_cache.selected_submarket;
    }

    setSelectedSubmarket(submarket): void {
        console.log('setSelectedSubmarket submarket', submarket);
        if(!submarket) return;
        this.qs_cache.selected_submarket = submarket;
        this.selected_submarket = submarket;
    }

    setSelectedSymbol(symbol): void {
        if(!symbol) return;
        console.log('setSelectedSymbol symbol', symbol);
        this.qs_cache.selected_symbol = symbol;
        this.selected_symbol = symbol;
    }

    isMarketClosed(market_name) {
        const market = this.processed_symbols[market_name];

        if (!market) {
            return true;
        }

        return Object.keys(market.submarkets).every(submarket_name => this.isSubmarketClosed(submarket_name));
    }

    isSubmarketClosed(submarket_name) {
        const market_name = Object.keys(this.processed_symbols).find(name => {
            const market = this.processed_symbols[name];
            return Object.keys(market.submarkets).includes(submarket_name);
        });

        if (!market_name) {
            return true;
        }

        const market = this.processed_symbols[market_name];
        const submarket = market.submarkets[submarket_name];

        if (!submarket) {
            return true;
        }

        const { symbols } = submarket;
        return Object.keys(symbols).every(symbol_name => this.isSymbolClosed(symbol_name));
    }

    isSymbolClosed(symbol_name) {
        return this.active_symbols.some(
            active_symbol =>
                active_symbol.symbol === symbol_name &&
                (!active_symbol.exchange_is_open || active_symbol.is_trading_suspended)
        );
    }

    sortDropdownOptions = (dropdown_options, closedFunc) => {
        const options = [...dropdown_options];

        options.sort((a, b) => {
            const is_a_closed = closedFunc.call(this, a[1]);
            const is_b_closed = closedFunc.call(this, b[1]);

            if (is_a_closed && !is_b_closed) {
                return 1;
            } else if (is_a_closed === is_b_closed) {
                return 0;
            }
            return -1;
        });

        return options;
    };

    getMarketDropdownOptions() {
        const market_options = [];

        Object.keys(this.processed_symbols).forEach(market_name => {
            const { display_name } = this.processed_symbols[market_name];
            const market_display_name = display_name  + (this.isMarketClosed(market_name) ? ` ${localize('(Closed)')}` : '');
            market_options.push([market_display_name, market_name]);
        });

        if (market_options.length === 0) {
            return config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
        }
        market_options.sort(a => (a[1] === 'synthetic_index' ? -1 : 1));

        const has_closed_markets = market_options.some(market_option => this.isMarketClosed(market_option[1]));

        if (has_closed_markets) {
            const sorted_options = this.sortDropdownOptions(market_options, this.isMarketClosed);

            if (this.isMarketClosed('forex')) {
                return sorted_options.sort(a => (a[1] === 'synthetic_index' ? -1 : 1));
            }

            return sorted_options;
        }

        return market_options;
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
                    submarkets: {},
                };
            }

            const { submarkets } = processed_symbols[symbol.market];

            if (!isExistingValue(submarkets, 'submarket')) {
                submarkets[symbol.submarket] = {
                    display_name: symbol.submarket_display_name,
                    symbols: {},
                };
            }

            const { symbols } = submarkets[symbol.submarket];

            if (!isExistingValue(symbols, 'symbol')) {
                symbols[symbol.symbol] = {
                    display_name: symbol.display_name,
                    pip_size: `${symbol.pip}`.length - 2,
                    is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
                };
            }

            return processed_symbols;
        }, {});
    }

    async updateMarketsDropdown(select_value, value, setFieldValue) {
        console.log('1');
        
        if(value){
            console.log('value', value);
            this.setSelectedMarket(value);
        }

        const { active_symbols } = ApiHelpers.instance;
        console.log('ApiHelpers active_symbols', active_symbols);
        this.active_symbols = active_symbols.active_symbols;

        this.processed_symbols = this.processActiveSymbols();
        const markets = this.getMarketDropdownOptions();

        const types_markets = markets.map(m => ({
            index: m[0],
            text: m[0],
            value: m[0],
        }));
        
        this.setMarketsDropdown(types_markets);
        let first_market = types_markets[0];
        if (this.selected_market && markets.some(e => e.value === this.selected_market.value)) {
            first_market = this.selected_market;
            runInAction(() => {
                first_market.value = this.getFieldValue(markets, this.selected_market.value);
            });
        } else {
            delete this.qs_cache.selected_market;
        }
        if (first_market) {
            this.setSelectedMarket(first_market);
            console.log('first market m', first_market);
            
            await this.updateSubmarketsDropdown(null, first_market, setFieldValue);

            if (setFieldValue) {
                setFieldValue('strategy__market', first_market.text);
            }
        }
    }

    async updateSubmarketsDropdown(select_value, market, setFieldValue) {
        console.log('2');
        const submarkets_dropdown = [];
        const current_market = market || this.selected_market.value || this.markets_dropdown[0]?.value;
        const filtered = this.active_symbols.map((s) => {
            if( current_market === s.market_display_name){
                return s.submarket_display_name;
            }
        });
        
        const uniq_submarkets = [...new Set(filtered)];
        uniq_submarkets.map((s) => {
            if(s){
                submarkets_dropdown.push({
                    value: s,
                    text: s
                })
            }
        });
        const { active_symbols } = ApiHelpers.instance;
        console.log('7active_symbols', active_symbols);
        
        const submarkets = active_symbols.getSubmarketDropdownOptions(current_market);
        console.log('submarkets', submarkets);
        
        const types_submarkets = submarkets.map(subm => ({
            index: subm[0],
            text: subm[0],
            value: subm[0],
        }));
        let first_submarket = types_submarkets[0];
        if (this.selected_submarket && submarkets.some(e => e.value === this.selected_submarket.value)) {
            first_submarket = this.selected_submarket;
            runInAction(() => {
                first_submarket.value = this.getFieldValue(submarkets, this.selected_submarket.value);
            });
        } else {
            delete this.qs_cache.selected_submarket;
        }
        if (first_submarket) {
            console.log('hiiiii', first_submarket);
            
            this.setSelectedSubmarket(first_submarket);
            await this.updateSymbolDropdown(null, first_submarket, setFieldValue);

            if (setFieldValue) {
                setFieldValue('strategy__submarket', first_submarket.text);
            }
        }
        
        console.log('updateSubmarketsDropdown submarkets_dropdown:', submarkets_dropdown, 'uniq_submarkets: ', uniq_submarkets);
        this.setSubmarketsDropdown(submarkets_dropdown);
    }

    async updateSymbolDropdown(select_value, submarket, setFieldValue) {
        console.log('3');
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getAllSymbols(/* should_be_open */ true);
        console.log('symbols', symbols);
        const current_submarket = submarket || this.selected_submarket.value || this.qs_cache.selected_submarket?.value;
        const symbols_dropdown = [];
        symbols.map((symbol: TSymbol) => {
            // console.log('current_submarket', current_submarket, 'symbol.submarket_display: ', symbol.submarket_display );
            
            if(current_submarket === symbol.submarket_display){
                if(symbol){
                    symbols_dropdown.push({
                        group: symbol.submarket_display,
                        text: symbol.symbol_display,
                        value: symbol.symbol_display, //symbol.symbol
                    });
                }
            };
        });
        console.log('symbols_dropdown', symbols_dropdown);

        this.setSymbolsDropdown(symbols_dropdown);

        if (!this.selected_symbol.value && symbols_dropdown.length) {
            console.log('my case');
            
            this.selected_symbol = symbols_dropdown[0];
        }

        const new_symbols = active_symbols.getSymbolDropdownOptions(current_submarket);
        
        const types_symbols = new_symbols.map(s => ({
            index: s[0],
            text: s[0],
            value: s[0],
        }));
        let first_symbol = types_symbols[0];
        console.log('types_symbols', types_symbols);
        
        if (this.selected_submarket && new_symbols.some(e => e.value === this.selected_symbol?.value)) {
            first_symbol = this.selected_symbol;
            runInAction(() => {
                first_symbol.value = this.getFieldValue(new_symbols, this.selected_symbol?.value);
            });
        } else {
            delete this.qs_cache.selected_symbol;
        }
        if (first_symbol) {
            this.setSelectedSymbol(first_symbol);

            if (setFieldValue) {
                setFieldValue('strategy__symbol', first_symbol.text);
            }
        }
    }

    async loadDataStrategy() {
        await this.updateMarketsDropdown();
        await this.updateSubmarketsDropdown();
        await this.updateSymbolDropdown();
    }

    getFieldValue = (list_items: TDropdowns, value: string): string => {
        const list_obj: TSelectedValuesSelect =
            list_items?.find(item =>
                typeof item.value !== 'string'
                    ? item.value === value
                    : item.value?.toLowerCase() === value?.toLowerCase()
            ) || {};

        return typeof list_obj !== 'string' ? list_obj?.value : '';
    };

    getFieldMap = (type) => {

        const field_mapping = {
            'market': {
                field_name: 'bot-builder__market',
                dropdown: this.markets_dropdown,
                selected: this.selected_market,
                setSelected: this.setSelectedMarket,
            },
            'submarket': {
                field_name: 'bot-builder__submarket',
                dropdown: this.submarkets_dropdown,
                selected: this.selected_submarket,
                setSelected: this.setSelectedSubmarket,
            },
            symbol: {
                field_name: 'bot-builder__symbol',
                dropdown: this.symbols_dropdown,
                selected: this.selected_symbol,
                setSelected: this.setSelectedSymbol,
            },
        };
        
        return field_mapping[type];
    };

    exportStrategyToJson = data => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'strategy.json';

        link.click();
    };

    onHideDropdownList(type, value, setFieldValue): void {
        console.log('onHideDropdownList type', type, 'value', value);
        
        const field_map = this.getFieldMap(type);
        
        const item = field_map.dropdown?.find(i => i.value?.toLowerCase() === value?.toLowerCase()) || field_map.selected;
        

        if (!item) {
            setFieldValue(field_map?.field_name, '');
            return;
        }

        if (item.value !== value) {
            setFieldValue(field_map.field_name, item.value);
        }

        if (item !== field_map.selected) {
            field_map.setSelected(item);
        }
        
    }

    async onChangeDropdownItem(type: any, value: string, setFieldValue: any): void {
        
        if (!value) {
            return;
        }

        const field_map = await this.getFieldMap(type);
        console.log('onChangeDropdownItem', 'type', type, 'value', value, field_map);
        
        if (type === 'market') {

            this.updateSubmarketsDropdown(null, value, setFieldValue);
            const market = this.markets_dropdown.find(item => item.value === value);

            if (market) {
                this.setSelectedMarket(market);
                setFieldValue(field_map?.field_name, market.text);
            }

        } else if (type === 'submarket') {

            this.updateSymbolDropdown(null, value, setFieldValue);
            const submarket = this.submarkets_dropdown.find(item => item.value === value);

            if (submarket) {
                this.setSelectedSubmarket(submarket);
                setFieldValue(field_map?.field_name, submarket.text);
            }
        } else if (type === 'symbol') {
            const symbol = this.symbols_dropdown.find(item => item.value === value);

            if (symbol) {
                this.setSelectedSymbol(symbol);
                setFieldValue(field_map?.field_name, symbol.text);
            }
        }
    }

    onScrollStopDropdownList = (type: any): void => {
        GTM.pushDataLayer({ event: `dbot_strategy_scroll_${type}` });
    };
}
