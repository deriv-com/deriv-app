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
import ApiHelpers from '../services/api/api-helpers';

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
            setSubmarketsDropdown: action.bound,
            setSymbolsDropdown: action.bound,
            setSelectedMarket: action.bound,
            setSelectedSubmarket: action.bound,
            setSelectedSymbol: action.bound,
            getFieldMap: action.bound,
            onHideDropdownList: action.bound,
            loadDataStrategy: action.bound,
            updateMarketsDropdown: action.bound,
            onChangeDropdownItem: action.bound,
            onScrollStopDropdownList: action.bound,
        });

        this.root_store = root_store;
    }

    selected_market: TMarket = (this.qs_cache.selected_market as TMarket) || {};
    selected_submarket: any = (this.qs_cache.selected_submarket) || {};
    selected_symbol: any = (this.qs_cache.selected_symbol as any) || {};
    markets_dropdown: TMarketDropdown = [];
    submarkets_dropdown: any = [];
    symbols_dropdown: any = [];

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
        this.markets_dropdown = markets;
    }

    setSubmarketsDropdown(submarkets): void {
        this.submarkets_dropdown = submarkets;
    }

    setSymbolsDropdown(symbols): void {
        this.symbols_dropdown = symbols;
    }

    setSelectedMarket(market): void {
        this.qs_cache.selected_market = market;
        this.selected_market = market;
        delete this.qs_cache.selected_submarket;
    }

    setSelectedSubmarket(submarket): void {
        this.qs_cache.selected_submarket = submarket;
        this.selected_submarket = submarket;
        delete this.qs_cache.selected_symbol;
    }

    setSelectedSymbol(symbol): void {
        this.qs_cache.selected_symbol = symbol;
        this.selected_symbol = symbol;
        //!TODO: for next field delete this.qs_cache....[name]
    }

    getActiveSymbols() {
        const { active_symbols } = ApiHelpers.instance;
        const markets = active_symbols.getMarketDropdownOptions();
        return {active_symbols: active_symbols, markets: markets}
    }

    async updateMarketsDropdown() {
        const active_symbols_helper = this.getActiveSymbols();
        const { active_symbols } = active_symbols_helper;
        const markets = active_symbols.getMarketDropdownOptions();

        const types_markets = markets.map((m, index) => ({
            index: index,
            text: m[0],
            value: m[0],
        }));
        
        this.setMarketsDropdown(types_markets);
        let first_market = types_markets[0];
        // 1. values were selected before, when refresh the page 
        if (this.selected_market && types_markets.some(e => e.value === this.selected_market.value)) {
            first_market = this.selected_market;
            runInAction(() => {
                first_market.value = this.getFieldValue(types_markets, this.selected_market.value);
            });
        // 2. the first loading the app in the browser
        } else {
            delete this.qs_cache.selected_market;
        }
        // for both cases 1, 2
        if (first_market) {
            this.setSelectedMarket(first_market);
        }

        this.updateSubmarketsDropdown(this.selected_market.value);
    }

    async updateSubmarketsDropdown(market, setFieldValue) {        
        // market for event onChange, this.selected_market.value for refresh the page & the first loading the page
        const current_market = market || this.selected_market.value;
        const active_symbols_helper = this.getActiveSymbols();
        const { active_symbols, markets } = active_symbols_helper;
        const market_short_name = markets.find(el => el[0] === current_market)[1];
        const submarkets = active_symbols.getSubmarketDropdownOptions(market_short_name);
        const submarkets_dropdown = 
            submarkets.map((s, index) => ({
                index: index,
                value: s[0],
                text: s[0],
                submarket_name: s[1]
        }));
        this.setSubmarketsDropdown(submarkets_dropdown);
        
        let first_submarket = submarkets_dropdown[0];
        if (this.selected_submarket && submarkets_dropdown.some(e => e.value === this.selected_submarket.value)) {
            first_submarket = this.selected_submarket;
            runInAction(() => {
                first_submarket.value = this.getFieldValue(submarkets_dropdown, this.selected_submarket.value);
            });
        } else {
            delete this.qs_cache.selected_submarket;
        }
        if (first_submarket) {
            this.setSelectedSubmarket(first_submarket);
            await this.updateSymbolDropdown(first_submarket, setFieldValue);

            if (setFieldValue) {
                setFieldValue('bot-builder__submarket', first_submarket.text);
            }
        }
    }

    async updateSymbolDropdown(submarket, setFieldValue) {
        const active_symbols_helper = this.getActiveSymbols();
        const { active_symbols } = active_symbols_helper;
        const submarket_short_name = submarket.submarket_name || this.selected_submarket.submarket_name;

        const symbols = active_symbols.getSymbolDropdownOptions(submarket_short_name);
        const symbols_dropdown = 
            symbols.map((s, index) => ({
                index: index,
                value: s[0],
                text: s[0],
                symbol_name: s[1],
            }));
        this.setSymbolsDropdown(symbols_dropdown);

        if (!this.selected_symbol.value && symbols_dropdown.length) {
            this.selected_symbol = symbols_dropdown[0];
        }

        let first_symbol = symbols_dropdown[0];
        
        if (this.selected_symbol && symbols_dropdown.some(e => e.value === this.selected_symbol?.value)) {
            first_symbol = this.selected_symbol;
            runInAction(() => {
                first_symbol.value = this.getFieldValue(symbols_dropdown, this.selected_symbol?.value);
            });
        } else {
            delete this.qs_cache.selected_symbol;
        }
        if (first_symbol) {
            this.setSelectedSymbol(first_symbol);
            // await this.update... !TODO: next field to update

            if (setFieldValue) {
                setFieldValue('bot-builder__symbol', first_symbol.text);
            }
        }
    }

    async loadDataStrategy() {
        await this.updateMarketsDropdown();
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
        
        if (type === 'market') {

            this.updateSubmarketsDropdown(value, setFieldValue);
            const market = this.markets_dropdown.find(item => item.value === value);

            if (market) {
                this.setSelectedMarket(market);
                setFieldValue(field_map?.field_name, market.text);
            }

        } else if (type === 'submarket') {

            this.updateSymbolDropdown(value, setFieldValue);
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
