import { computed, observable, action, makeObservable, runInAction } from 'mobx';
// import config_data from '../strategies/default.json';
import { getSetting, storeSetting } from 'Utils/settings';
import RootStore from './root-store';
import {
    TMarket,
    TMarketDropdown,
    TMarketOption,
    TDropdowns,
    TSelectedValuesSelect,
    TQSCache,
} from '../components/blocks/blocks.types';
// import {ApiHelpers, ActiveSymbols} from 'Services';
import { api } from "../services/api/api";
import {config} from '../constants/config-blocks';
import { localize } from '@deriv/translations';

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
            symbol_dropdown: observable,
            setMarketsDropdown: action.bound,
            setSelectedMarket: action.bound,
            setSelectedSubmarket: action.bound,
            getFieldMap: action.bound,
            onHideDropdownList: action.bound,
            loadDataStrategy: action.bound,
            updateMarketsDropdown: action.bound,

            processed_symbols: observable,
            active_symbols: observable,
        });

        this.root_store = root_store;
    }

    selected_market: TMarket = (this.qs_cache.selected_market as TMarket) || {};
    selected_submarket: any = (this.qs_cache.selected_submarket) || {};
    selected_symbol: TMarketOption = (this.qs_cache.symbol as TMarketOption) || {};
    markets_dropdown: TMarketDropdown = [];
    submarkets_dropdown: TMarketDropdown = [];
    symbol_dropdown: any = [];
    processed_symbols: any = {};

    active_symbols = [];
    disabled_markets = [];
    disabled_symbols = ['frxGBPNOK', 'frxUSDNOK', 'frxUSDNEK', 'frxUSDSEK']; // These are only forward-starting.
    disabled_submarkets = ['energy', 'step_index', 'crash_index'];
    is_initialised = false;

    get initial_values() {
        const init = {
            'bot-builder__market': this.getFieldValue(this.markets_dropdown, this.selected_market.value) || '',
            'bot-builder__submarket': this.getFieldValue(this.submarkets_dropdown, this.selected_submarket.value) || '',
            'bot-builder__symbol': this.getFieldValue(this.symbol_dropdown, this.selected_symbol.value) || '',
        };
        storeSetting('strategy', this.qs_cache);
        console.log('initial_values: ', init);
        
        return init;
    }

    setMarketsDropdown(markets: TMarketOption): void {
        console.log('setMarketsDropdown markets', markets);
        
        this.markets_dropdown = markets;
    }

    setTypesSubmarketsDropdown(types_submarkets_options: TMarketOption): void {
        console.log('setTypesSubmarketsDropdown types_submarkets_options', types_submarkets_options);
        
        this.submarkets_dropdown = types_submarkets_options;
    }

    setSelectedMarket(market): void {
        console.log('setSelectedMarket market: ', market);
        
        this.qs_cache.selected_market = market;
        this.selected_market = market;
        // delete this.qs_cache.selected_submarket;
    }

    setSelectedSubmarket(submarket): void {
        console.log('setSelectedSubmarket submarket', submarket);
        
        this.qs_cache.selected_submarket = submarket;
        this.selected_submarket = submarket;
    }

    onChangeDropdownItem(type: TDropdownItems, value: string, setFieldValue: TSetFieldValue): void {
        console.log('onChangeDropdownItem', 'type: ', type, 'value', value);
        
        if (!value) {
            return;
        }

        // const field_map = this.getFieldMap(type);
        // if (type === 'symbol') {
        //     this.updateTradeTypeDropdown(value, setFieldValue);

        //     const symbol = this.symbol_dropdown.find(item => item.value === value);

        //     if (symbol) {
        //         this.setSelectedSubmarket(symbol);
        //         setFieldValue(field_map?.field_name, symbol.text);
        //     }


        // } else if (type === 'trade-type') {
        //     this.updateDurationDropdown(this.selected_symbol.value, value, setFieldValue);

        //     const trade_type = this.trade_type_dropdown.find(item => item.value === value);

        //     if (trade_type) {
        //         this.setSelectedTradeType(trade_type);
        //         setFieldValue(field_map?.field_name, trade_type.text);
        //     }
        // } else if (type === 'duration-unit') {
        //     this.updateDurationValue(value, setFieldValue);

        //     const duration_unit = this.duration_unit_dropdown.find(item => item.value === value);

        //     if (duration_unit) {
        //         this.setSelectedDurationUnit(duration_unit);
        //         setFieldValue(field_map?.field_name, duration_unit.text);
        //     }
        // } else if (type === 'type-strategy') {
        //     const typeStrategy = this.types_strategies_dropdown.find(item => item.value === value);

        //     if (typeStrategy) {
        //         this.setSelectedTypeStrategy(typeStrategy);
        //         this.setActiveTypeStrategyIndex(typeStrategy.index);
        //         setFieldValue(field_map?.field_name, typeStrategy.text);
        //     }
        // }
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


    async updateMarketsDropdown() { //change name
        // const {
        //     settings: { markets },
        // } = config_data;
        // const { active_symbols } = await ApiHelpers.instance;
        // const { active_symbols2 } = await ActiveSymbols.instance;
        // const { active_symbols, error } = await WS?.authorized?.activeSymbols();


        api
        .send({
          active_symbols: "brief",
          product_type: "basic",
        })
        .then((response) => {
            console.log('response.active_symbols', response.active_symbols);
            this.active_symbols = response.active_symbols;

            this.processed_symbols = this.processActiveSymbols();
            // const markets = [...new Set(this.getMarketDropdownOptions())];
            const markets = this.getMarketDropdownOptions();
            console.log('markets: ', markets, 'this.processed_symbols: ', this.processed_symbols);

            const market_name = markets.find(m => {
                    if( this.selected_market && m[0] === this.selected_market){
                    return m[1];
                }else{
                    return 'synthetic_index';
                }
            })[1];
            

            const submarkets = this.getSubmarketDropdownOptions(market_name);
            console.log('submarkets: ', submarkets, 'this.selected_market', this.selected_market, 'qwe', market_name);
    
            // const types_markets = Object.values(markets).map(m => ({
            //     index: m.index,
            //     text: m.label,
            //     value: m.label,
            // }));
            const types_markets = markets.map(m => ({
                // index: m.index,
                text: m[0],
                value: m[0],
            }));
            
            this.setMarketsDropdown(types_markets);

            const types_submarkets = submarkets.map(m => ({
                // index: m.index,
                text: m[1],
                value: m[1],
            }));
            this.setTypesSubmarketsDropdown(types_submarkets);
            
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
                // await this.updateDurationDropdown(
                //     this.selected_symbol.value,
                //     this.selected_trade_type.value,
                //     setFieldValue
                // );
    
                if (setFieldValue) {
                    setFieldValue('bot-builder__market', first_market.value);
                }
                //!TODO 
                // this.setSelectedMarket(first_market);
            }
        });
    }

    getSubmarketDropdownOptions(market) {
        const submarket_options = [];
        const market_obj = this.processed_symbols[market];

        if (market_obj) {
            const { submarkets } = market_obj;

            Object.keys(submarkets).forEach(submarket_name => {
                const { display_name } = submarkets[submarket_name];
                const submarket_display_name =
                    display_name + (this.isSubmarketClosed(submarket_name) ? ` ${localize('(Closed)')}` : '');
                submarket_options.push([submarket_display_name, submarket_name]);
            });
        }

        if (submarket_options.length === 0) {
            return config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
        }
        if (market === 'synthetic_index') {
            submarket_options.sort(a => (a[1] === 'random_index' ? -1 : 1));
        }

        return this.sortDropdownOptions(submarket_options, this.isSubmarketClosed);
    }

    updateSubmarketsDropdown(submarket) {

    }

    async loadDataStrategy() {
        await this.updateMarketsDropdown();
        await this.updateSubmarketsDropdown();
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
        console.log('type', type, 'value', value);
        
        const field_map = this.getFieldMap(type);
        console.log('field_map', field_map.dropdown);
        
        const item = field_map.dropdown?.find(i => i.value.toLowerCase() === value.toLowerCase()) || field_map.selected;
        console.log('item', item);
        

        if (!item) {
            setFieldValue(field_map?.field_name, '');
            return;
        }

        if (item.value !== value) {
            setFieldValue(field_map.field_name, item.value);
        }

        if (item !== field_map.selected) {
            console.log('3', item, field_map.selected);
            field_map.setSelected(item);
        }
        
    }
}
