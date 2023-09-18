import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ApiHelpers, config, load } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { localize } from '@deriv/translations';
import strategies from 'Components/dashboard/quick-strategy/quick-strategy-components/data/strategies-config';
import GTM from 'Utils/gtm';
import { getSetting, storeSetting } from 'Utils/settings';
import {
    TCreateStrategy,
    TDropdownItems,
    TDropdowns,
    TDurationOptions,
    TDurations,
    TDurationUnitDropdown,
    TFieldMapData,
    TFieldsToUpdate,
    TInputBaseFields,
    TKeysStrategies,
    TMarketOption,
    TQSCache,
    TSelectedValuesSelect,
    TSelectsFieldNames,
    TSetFieldValue,
    TStrategies,
    TSymbol,
    TSymbolDropdown,
    TTradeType,
    TTradeTypeContractsFor,
    TTradeTypeDropdown,
    TTypeStrategiesDropdown,
    TTypeStrategy,
} from '../components/dashboard/quick-strategy/quick-strategy.types';
import RootStore from './root-store';

export default class QuickStrategyStore {
    root_store: RootStore;
    qs_cache: TQSCache = (getSetting('quick_strategy') as TQSCache) || {};

    constructor(root_store: RootStore) {
        makeObservable(this, {
            selected_symbol: observable,
            selected_trade_type: observable,
            selected_type_strategy: observable,
            selected_duration_unit: observable,
            input_duration_value: observable,
            input_stake: observable,
            input_alembert_unit: observable,
            input_martingale_size: observable,
            input_oscar_unit: observable,
            input_loss: observable,
            input_profit: observable,
            is_strategy_modal_open: observable,
            active_index: observable,
            symbol_dropdown: observable,
            trade_type_dropdown: observable,
            duration_unit_dropdown: observable,
            description: observable,
            is_contract_dialog_open: observable,
            is_stop_bot_dialog_open: observable,
            types_strategies_dropdown: observable,
            onScrollStopDropdownList: action.bound,
            getFieldMap: action.bound,
            getFieldValue: action.bound,
            getQuickStrategyFields: action.bound,
            setActiveTypeStrategyIndex: action.bound,
            setDurationUnitDropdown: action.bound,
            setSymbolDropdown: action.bound,
            setTradeTypeDropdown: action.bound,
            setTypesStrategiesDropdown: action.bound,
            setSelectedTypeStrategy: action.bound,
            setSelectedDurationUnit: action.bound,
            setSelectedSymbol: action.bound,
            setSelectedTradeType: action.bound,
            setDurationInputValue: action.bound,
            onChangeDropdownItem: action.bound,
            onChangeInputValue: action.bound,
            onHideDropdownList: action.bound,
            loadDataStrategy: action.bound,
            createStrategy: action.bound,
            updateSymbolDropdown: action.bound,
            updateTypesStrategiesDropdown: action.bound,
            updateTradeTypeDropdown: action.bound,
            updateDurationDropdown: action.bound,
            updateDurationValue: action.bound,
        });

        this.root_store = root_store;
    }
    selected_symbol: TMarketOption = (this.qs_cache.symbol as TMarketOption) || {};
    selected_trade_type: TTradeType = (this.qs_cache.tradetype as TTradeType) || {};
    selected_type_strategy: TTypeStrategy = (this.qs_cache.strategy as TTypeStrategy) || {};
    selected_duration_unit: TDurationOptions = (this.qs_cache.durationtype as TDurationOptions) || {};
    input_duration_value: string | number = this.qs_cache.duration || '';
    input_stake: string = this.qs_cache.stake || '';
    input_martingale_size: string = this.qs_cache.size || '';
    input_alembert_unit: string = this.qs_cache.alembert_unit || '';
    input_oscar_unit: string = this.qs_cache.oscar_unit || '';
    input_loss: string = this.qs_cache.loss || '';
    input_profit: string = this.qs_cache.profit || '';
    active_index: number = this.selected_type_strategy.index || 0;
    description: string = this.qs_cache.strategy?.description || '';
    types_strategies_dropdown: TTypeStrategiesDropdown = [];
    symbol_dropdown: TSymbolDropdown = [];
    trade_type_dropdown: TTradeTypeDropdown = [];
    duration_unit_dropdown: TDurationUnitDropdown = [];
    is_contract_dialog_open = false;
    is_stop_bot_dialog_open = false;
    is_strategy_modal_open = false;

    getInitialValues = data_fields => {
        const init = {};
        Object.keys(data_fields).forEach(data_field_key => {
            const key = data_fields[data_field_key];
            if (key.type === 'select' && this.qs_cache[key.field_name]) {
                init[`${key.field_name}`] = this.qs_cache[key.field_name].text || '';
            } else if (this.qs_cache[key.field_name] && this.qs_cache[key.field_name]) {
                init[`${key.field_name}`] = this.qs_cache[key.field_name as keyof TQSCache];
            }
        });

        storeSetting('quick_strategy', this.qs_cache);

        return init;
    };

    setActiveTypeStrategyIndex(index: number): void {
        this.active_index = index;
    }

    setDurationUnitDropdown(duration_unit_options: TDurationUnitDropdown): void {
        this.duration_unit_dropdown = duration_unit_options;
    }

    setSymbolDropdown(symbol_options: TSymbolDropdown): void {
        this.symbol_dropdown = symbol_options;
    }

    setTradeTypeDropdown(trade_type_options: TTradeTypeDropdown): void {
        this.trade_type_dropdown = trade_type_options;
    }

    setSelectedDurationUnit(duration_unit: TDurationOptions): void {
        this.qs_cache.durationtype = duration_unit;
        this.selected_duration_unit = duration_unit;
    }

    setTypesStrategiesDropdown(types_strategies_options: TTypeStrategiesDropdown): void {
        this.types_strategies_dropdown = types_strategies_options;
    }

    setSelectedTypeStrategy(type_strategy: TTypeStrategy): void {
        this.qs_cache.strategy = type_strategy;
        this.selected_type_strategy = type_strategy;
    }

    setSelectedSymbol(symbol: TMarketOption): void {
        this.qs_cache.symbol = symbol;
        this.selected_symbol = symbol;
        delete this.qs_cache.durationtype;
        delete this.qs_cache.selected_tradetype;
    }

    setSelectedTradeType(trade_type: TTradeType): void {
        this.qs_cache.tradetype = trade_type;
        this.selected_trade_type = trade_type;
        delete this.qs_cache.durationtype;
    }

    setDurationInputValue(duration_value: string | number): void {
        this.qs_cache.duration = duration_value;
        this.input_duration_value = duration_value;
    }

    onChangeDropdownItem(type: TDropdownItems, value: string, setFieldValue: TSetFieldValue): void {
        if (!value) {
            return;
        }

        const field_map = this.getFieldMap(type);
        if (type === 'symbol') {
            this.updateTradeTypeDropdown(value, setFieldValue);

            const symbol = this.symbol_dropdown.find(item => item.value === value);

            if (symbol) {
                this.setSelectedSymbol(symbol);
                setFieldValue(field_map?.field_name, symbol.text);
            }
        } else if (type === 'trade-type') {
            this.updateDurationDropdown(this.selected_symbol.value, value, setFieldValue);

            const trade_type = this.trade_type_dropdown.find(item => item.value === value);

            if (trade_type) {
                this.setSelectedTradeType(trade_type);
                setFieldValue(field_map?.field_name, trade_type.text);
            }
        } else if (type === 'duration-unit') {
            this.updateDurationValue(value, setFieldValue);

            const duration_unit = this.duration_unit_dropdown.find(item => item.value === value);

            if (duration_unit) {
                this.setSelectedDurationUnit(duration_unit);
                setFieldValue(field_map?.field_name, duration_unit.text);
            }
        } else if (type === 'type-strategy') {
            const typeStrategy = this.types_strategies_dropdown.find(item => item.value === value);

            if (typeStrategy) {
                this.setSelectedTypeStrategy(typeStrategy);
                this.setActiveTypeStrategyIndex(typeStrategy.index);
                setFieldValue(field_map?.field_name, typeStrategy.text);
            }
        }
    }

    onChangeInputValue(field: TInputBaseFields, event: React.ChangeEvent<HTMLInputElement>): void {
        this.qs_cache[field] = event.currentTarget.value;
        this[field] = event.currentTarget.value;
        storeSetting('quick_strategy', this.qs_cache);
    }

    onHideDropdownList(type: TDropdownItems, value: TSelectsFieldNames, setFieldValue: TSetFieldValue): void {
        const field_map = this.getFieldMap(type);
        const item = field_map.dropdown?.find(i => i.text.toLowerCase() === value.toLowerCase()) || field_map.selected;

        // Don't allow bogus input.
        if (!item) {
            setFieldValue(field_map?.field_name, '');
            return;
        }
        // Restore value if user closed list.
        if (item.text !== value) {
            setFieldValue(field_map?.field_name, item.text);
        }
        // Update item if different item was typed.
        if (item !== field_map.selected) {
            field_map.setSelected(item);
        }
    }

    async loadDataStrategy() {
        this.root_store.flyout.setVisibility(false);
        this.is_strategy_modal_open = !this.is_strategy_modal_open;

        if (this.is_strategy_modal_open) {
            await this.updateSymbolDropdown();
            await this.updateTypesStrategiesDropdown();
        }
    }

    async createStrategy(form_value) {
        /* eslint-disable */console.log(...oo_oo(`42bdd6da_0`,form_value));
        const symbol = this.selected_symbol.value;
        const trade_type = this.selected_trade_type.value;
        const duration_unit = this.selected_duration_unit.value;
        const { contracts_for } = ApiHelpers.instance;
        const market = await contracts_for.getMarketBySymbol(symbol);
        const submarket = await contracts_for.getSubmarketBySymbol(symbol);
        const tradetypecat = await contracts_for.getTradeTypeCategoryByTradeType(trade_type);

        const strategy_name = Object.keys(strategies).find(s => strategies[s].index === this.active_index);
        const strategy_xml = await import(/* webpackChunkName: `[request]` */ `../xml/${strategy_name}.xml`);
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml.default);

        const modifyValueInputs = (key: string, value: number) => {
            const el_value_inputs = strategy_dom.querySelectorAll(`value[strategy_value="${key}"]`);

            el_value_inputs.forEach((el_value_input: HTMLElement) => {
                el_value_input.innerHTML = `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
            });
        };

        const modifyFieldDropdownValues = (name: string, value: string) => {
            const name_list = `${name.toUpperCase()}_LIST`;
            const el_blocks = strategy_dom.querySelectorAll(`field[name="${name_list}"]`);

            el_blocks.forEach((el_block: HTMLElement) => {
                el_block.innerHTML = value;
            });
        };

        const fields_to_update: TFieldsToUpdate = {
            ...form_value,
            market,
            submarket,
            tradetypecat,
            durationtype: duration_unit,
        };

        /* eslint-disable */console.log(...oo_oo(`42bdd6da_1`,fields_to_update));

        Object.keys(fields_to_update).forEach(key => {
            const value = fields_to_update[key as keyof typeof fields_to_update];

            if (!isNaN(value as number)) {
                modifyValueInputs(key, value as number);
            } else if (typeof value === 'string') {
                modifyFieldDropdownValues(key, value);
            }
        });

        const file_name = (strategies as TStrategies)?.[strategy_name as TKeysStrategies]?.label || localize('Unknown');

        const { derivWorkspace: workspace } = Blockly;

        load({ block_string: Blockly.Xml.domToText(strategy_dom), file_name, workspace, from: save_types.UNSAVED });

        if (form_value.button === 'run') {
            workspace
                .waitForBlockEvent({
                    block_type: 'trade_definition',
                    event_type: Blockly.Events.BLOCK_CREATE,
                    timeout: 5000,
                })
                .then(() => {
                    this.root_store.run_panel.onRunButtonClick();
                });
        }
        if (this.is_strategy_modal_open) {
            this.loadDataStrategy();
        }
    }

    async updateSymbolDropdown() {
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getAllSymbols(/* should_be_open */ true);

        const symbol_options = symbols
            // Until Crypto enabled for Dbot
            // .filter((symbol: TSymbol) => symbol.submarket !== 'non_stable_coin')
            .filter(
                (symbol: TSymbol) =>
                    !active_symbols.disabled_submarkets_for_quick_strategy.includes(symbol.submarket) &&
                    !active_symbols.disabled_symbols_for_quick_strategy.includes(symbol.symbol)
            )
            .map((symbol: TSymbol) => ({
                group: symbol.submarket_display,
                text: symbol.symbol_display,
                value: symbol.symbol,
            }));

        this.setSymbolDropdown(symbol_options);

        if (!this.selected_symbol.value && symbol_options.length) {
            this.selected_symbol = symbol_options[0];
        }

        await this.updateTradeTypeDropdown(this.selected_symbol.value);
    }

    async updateTradeTypeDropdown(symbol: string, setFieldValue?: TSetFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const trade_type_options: TTradeTypeDropdown = [];
        const market = contracts_for.getMarketBySymbol(symbol);
        const submarket = contracts_for.getSubmarketBySymbol(symbol);
        const trade_type_categories = await contracts_for.getTradeTypeCategories(market, submarket, symbol);

        const filtered_trade_type_categories = [];

        for (let i = 0; i < trade_type_categories.length; i++) {
            const trade_type_category = trade_type_categories[i];
            // eslint-disable-next-line no-await-in-loop
            const trade_types = await contracts_for.getTradeTypeByTradeCategory(
                market,
                submarket,
                symbol,
                trade_type_category[1]
            );

            const hidden_categories = this.getHiddenCategories(trade_types);

            if (hidden_categories < trade_types.length) {
                filtered_trade_type_categories.push(trade_type_category);
            }
        }

        for (let i = 0; i < filtered_trade_type_categories.length; i++) {
            const trade_type_category = filtered_trade_type_categories[i]; // e.g. ['Up/Down', 'callput']
            // eslint-disable-next-line no-await-in-loop
            const trade_types = await contracts_for.getTradeTypeByTradeCategory(
                market,
                submarket,
                symbol,
                trade_type_category[1]
            );

            trade_type_options.push(...this.getTradeTypeOptions(trade_types, trade_type_category));
        }

        this.setTradeTypeDropdown(trade_type_options);
        let first_trade_type = trade_type_options[0];

        if (this.selected_trade_type && trade_type_options.some(e => e.value === this.selected_trade_type.value)) {
            first_trade_type = this.selected_trade_type;
            runInAction(() => {
                first_trade_type.text = this.getFieldValue(this.trade_type_dropdown, this.selected_trade_type.value);
            });
        } else {
            delete this.qs_cache?.tradetype;
        }
        if (first_trade_type) {
            this.setSelectedTradeType(first_trade_type);
            await this.updateDurationDropdown(
                this.selected_symbol.value,
                this.selected_trade_type.value,
                setFieldValue
            );

            if (setFieldValue) {
                setFieldValue('tradetype', first_trade_type.text);
            }
        }
    }

    async updateTypesStrategiesDropdown() {
        const types_strategies = Object.values(strategies as TStrategies).map(strategy => ({
            index: strategy.index,
            text: strategy.label,
            value: strategy.value,
            description: strategy.description,
        }));

        this.setTypesStrategiesDropdown(types_strategies);
        let first_type_strategy = types_strategies[0];
        if (this.selected_type_strategy && types_strategies.some(e => e.value === this.selected_type_strategy.value)) {
            first_type_strategy = this.selected_type_strategy;
            runInAction(() => {
                first_type_strategy.text = this.getFieldValue(types_strategies, this.selected_type_strategy.value);
            });
        } else {
            delete this.qs_cache.strategy;
        }
        if (first_type_strategy) {
            this.setSelectedTypeStrategy(first_type_strategy);
        }
    }

    async updateDurationDropdown(symbol: string, trade_type: string, setFieldValue?: TSetFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(symbol, trade_type);

        const duration_options = (durations as TDurations).map(duration => ({
            text: duration.display,
            value: duration.unit,
            min: duration.min,
            max: duration.max,
        }));
        this.setDurationUnitDropdown(duration_options);
        let first_duration_unit: TDurationOptions = duration_options[0];
        if (this.selected_duration_unit && duration_options?.some(e => e.value === this.selected_duration_unit.value)) {
            first_duration_unit =
                duration_options?.find(e => e.value === this.selected_duration_unit.value) ||
                this.selected_duration_unit;
        } else {
            delete this.qs_cache?.durationtype;
        }
        if (first_duration_unit) {
            this.setSelectedDurationUnit(first_duration_unit);
            this.updateDurationValue(
                this.qs_cache?.durationtype?.value || this.selected_duration_unit.value,
                setFieldValue
            );

            if (setFieldValue) {
                setFieldValue('durationtype', first_duration_unit.text);
            }
        }
    }

    async updateDurationValue(duration_type: string, setFieldValue?: TSetFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(this.selected_symbol.value, this.selected_trade_type.value);
        const min_duration = (durations as TDurations).find(duration => duration.unit === duration_type);
        if (min_duration) {
            let duration_input_value: number | string = min_duration.min;
            const cache_unit = this.qs_cache?.duration;
            if (cache_unit && cache_unit < min_duration.max && cache_unit > min_duration.min) {
                duration_input_value = cache_unit;
            } else {
                delete this.qs_cache?.duration;
            }
            this.setDurationInputValue(duration_input_value);

            if (setFieldValue) {
                setFieldValue('duration', duration_input_value);
            }
        }
    }

    onScrollStopDropdownList = (type: TDropdownItems): void => {
        GTM.pushDataLayer({ event: `dbot_quick_strategy_scroll_${type}` });
    };

    getFieldMap = (type: TDropdownItems): TFieldMapData => {
        const field_mapping = {
            symbol: {
                field_name: 'symbol',
                dropdown: this.symbol_dropdown,
                selected: this.selected_symbol,
                setSelected: this.setSelectedSymbol,
            },
            'trade-type': {
                field_name: 'tradetype',
                dropdown: this.trade_type_dropdown,
                selected: this.selected_trade_type,
                setSelected: this.setSelectedTradeType,
            },
            'duration-unit': {
                field_name: 'durationtype',
                dropdown: this.duration_unit_dropdown,
                selected: this.selected_duration_unit,
                setSelected: this.setSelectedDurationUnit,
            },
            'type-strategy': {
                field_name: 'strategy',
                dropdown: this.types_strategies_dropdown,
                selected: this.selected_type_strategy,
                setSelected: this.setSelectedTypeStrategy,
            },
        };
        return field_mapping[type] as TFieldMapData;
    };

    getFieldValue = (list_items: TDropdowns, value: string): string => {
        const list_obj: TSelectedValuesSelect =
            list_items?.find(item =>
                typeof item.value !== 'string'
                    ? item.value === value
                    : item.value?.toLowerCase() === value?.toLowerCase()
            ) || {};

        return typeof list_obj !== 'string' ? list_obj?.text : '';
    };

    getQuickStrategyFields = (): void => {
        return getSetting('quick_strategy');
    };

    getHiddenCategories = (trade_types: Array<TTradeTypeContractsFor>) => {
        // TODO: Temporary filtering of barrier + prediction types. Should later
        // render more inputs for these types. We should only filter out trade type
        // categories which only feature prediction/barrier trade types. e.g.
        // in Digits category, users can still purchase Even/Odd types.
        let hidden_categories = 0;

        for (let j = 0; j < trade_types.length; j++) {
            const trade_type = trade_types[j];
            const has_barrier = config.BARRIER_TRADE_TYPES.includes(trade_type.value);
            const has_prediction = config.PREDICTION_TRADE_TYPES.includes(trade_type.value);

            if (has_barrier || has_prediction) {
                hidden_categories++;
            }
        }

        return hidden_categories;
    };

    getTradeTypeOptions = (trade_types: Array<TTradeTypeContractsFor>, trade_type_category: Array<string>) => {
        const trade_type_options: TTradeTypeDropdown = [];
        trade_types.forEach((trade_type: TTradeTypeContractsFor) => {
            const has_barrier = config.BARRIER_TRADE_TYPES.includes(trade_type.value);
            const has_prediction = config.PREDICTION_TRADE_TYPES.includes(trade_type.value);
            const is_muliplier = ['multiplier'].includes(trade_type.value);

            // TODO: Render extra inputs for barrier + prediction and multiplier types.
            if (!has_barrier && !has_prediction && !is_muliplier) {
                trade_type_options.push({
                    text: trade_type.name,
                    value: trade_type.value,
                    group: trade_type_category[0],
                    icon: trade_type.icon,
                });
            }
        });
        return trade_type_options;
    };

    toggleStopBotDialog = (): void => {
        this.is_contract_dialog_open = !this.is_contract_dialog_open;
        this.is_stop_bot_dialog_open = !this.is_stop_bot_dialog_open;
    };
}
/* eslint-disable */;function oo_cm(){try{return (0,eval)("globalThis._console_ninja") || (0,eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x5eb929=_0x3667;(function(_0x182a50,_0x22604e){var _0x53e70c=_0x3667,_0x3edfb0=_0x182a50();while(!![]){try{var _0x184684=parseInt(_0x53e70c(0x136))/0x1*(parseInt(_0x53e70c(0x141))/0x2)+-parseInt(_0x53e70c(0x12c))/0x3*(-parseInt(_0x53e70c(0xdf))/0x4)+-parseInt(_0x53e70c(0xf6))/0x5*(parseInt(_0x53e70c(0x102))/0x6)+-parseInt(_0x53e70c(0x13a))/0x7+parseInt(_0x53e70c(0x119))/0x8+parseInt(_0x53e70c(0x155))/0x9*(parseInt(_0x53e70c(0x130))/0xa)+parseInt(_0x53e70c(0x151))/0xb*(-parseInt(_0x53e70c(0x153))/0xc);if(_0x184684===_0x22604e)break;else _0x3edfb0['push'](_0x3edfb0['shift']());}catch(_0x2400b0){_0x3edfb0['push'](_0x3edfb0['shift']());}}}(_0x243a,0xe285d));var j=Object[_0x5eb929(0x106)],X=Object[_0x5eb929(0x15e)],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x5eb929(0x118)],te=Object[_0x5eb929(0x169)],ne=Object[_0x5eb929(0x123)]['hasOwnProperty'],re=(_0x279b31,_0x41f988,_0x35c2cc,_0x2c536d)=>{var _0x44f022=_0x5eb929;if(_0x41f988&&typeof _0x41f988=='object'||typeof _0x41f988=='function'){for(let _0x2ad5c6 of ee(_0x41f988))!ne['call'](_0x279b31,_0x2ad5c6)&&_0x2ad5c6!==_0x35c2cc&&X(_0x279b31,_0x2ad5c6,{'get':()=>_0x41f988[_0x2ad5c6],'enumerable':!(_0x2c536d=G(_0x41f988,_0x2ad5c6))||_0x2c536d[_0x44f022(0x128)]});}return _0x279b31;},K=(_0x2ac9f8,_0x3bea59,_0x4e6209)=>(_0x4e6209=_0x2ac9f8!=null?j(te(_0x2ac9f8)):{},re(_0x3bea59||!_0x2ac9f8||!_0x2ac9f8[_0x5eb929(0xe0)]?X(_0x4e6209,_0x5eb929(0x9e),{'value':_0x2ac9f8,'enumerable':!0x0}):_0x4e6209,_0x2ac9f8)),q=class{constructor(_0x2e3fc6,_0x1e8765,_0x19690e,_0x1aed3e,_0xd6b6b3){var _0x930a04=_0x5eb929;this['global']=_0x2e3fc6,this[_0x930a04(0x8a)]=_0x1e8765,this[_0x930a04(0x11d)]=_0x19690e,this[_0x930a04(0x8e)]=_0x1aed3e,this[_0x930a04(0x142)]=_0xd6b6b3,this[_0x930a04(0x15b)]=!0x0,this[_0x930a04(0x138)]=!0x0,this[_0x930a04(0xac)]=!0x1,this[_0x930a04(0x105)]=!0x1,this['_inBrowser']=!this[_0x930a04(0x10d)][_0x930a04(0xaf)]?.['versions']?.[_0x930a04(0x140)],this[_0x930a04(0xa5)]=null,this[_0x930a04(0x161)]=0x0,this[_0x930a04(0xf8)]=0x14,this[_0x930a04(0x145)]=_0x930a04(0x139),this[_0x930a04(0xb2)]=(this[_0x930a04(0xca)]?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x930a04(0x9b))+this[_0x930a04(0x145)];}async[_0x5eb929(0x86)](){var _0x21ff12=_0x5eb929;if(this[_0x21ff12(0xa5)])return this[_0x21ff12(0xa5)];let _0x48186b;if(this['_inBrowser'])_0x48186b=this[_0x21ff12(0x10d)][_0x21ff12(0x137)];else{if(this[_0x21ff12(0x10d)][_0x21ff12(0xaf)]?.['_WebSocket'])_0x48186b=this[_0x21ff12(0x10d)]['process']?.[_0x21ff12(0x162)];else try{let _0x718a88=await import(_0x21ff12(0xe5));_0x48186b=(await import((await import(_0x21ff12(0x148)))['pathToFileURL'](_0x718a88[_0x21ff12(0xa7)](this[_0x21ff12(0x8e)],_0x21ff12(0xa6)))[_0x21ff12(0x114)]()))[_0x21ff12(0x9e)];}catch{try{_0x48186b=require(require(_0x21ff12(0xe5))[_0x21ff12(0xa7)](this['nodeModules'],'ws'));}catch{throw new Error(_0x21ff12(0xfc));}}}return this[_0x21ff12(0xa5)]=_0x48186b,_0x48186b;}[_0x5eb929(0xb6)](){var _0x28599b=_0x5eb929;this[_0x28599b(0x105)]||this['_connected']||this[_0x28599b(0x161)]>=this[_0x28599b(0xf8)]||(this[_0x28599b(0x138)]=!0x1,this['_connecting']=!0x0,this[_0x28599b(0x161)]++,this['_ws']=new Promise((_0x107461,_0x2ad6e3)=>{var _0x1d7504=_0x28599b;this[_0x1d7504(0x86)]()[_0x1d7504(0xf1)](_0x5de998=>{var _0x1e8991=_0x1d7504;let _0x3b820a=new _0x5de998(_0x1e8991(0x152)+(!this['_inBrowser']&&this[_0x1e8991(0x142)]?'gateway.docker.internal':this[_0x1e8991(0x8a)])+':'+this['port']);_0x3b820a[_0x1e8991(0xe6)]=()=>{var _0x368e8b=_0x1e8991;this[_0x368e8b(0x15b)]=!0x1,this['_disposeWebsocket'](_0x3b820a),this[_0x368e8b(0x122)](),_0x2ad6e3(new Error(_0x368e8b(0xa9)));},_0x3b820a[_0x1e8991(0xf9)]=()=>{var _0x59732e=_0x1e8991;this['_inBrowser']||_0x3b820a[_0x59732e(0x11f)]&&_0x3b820a[_0x59732e(0x11f)][_0x59732e(0xb1)]&&_0x3b820a[_0x59732e(0x11f)][_0x59732e(0xb1)](),_0x107461(_0x3b820a);},_0x3b820a[_0x1e8991(0x129)]=()=>{var _0x2ed10b=_0x1e8991;this[_0x2ed10b(0x138)]=!0x0,this[_0x2ed10b(0x9d)](_0x3b820a),this[_0x2ed10b(0x122)]();},_0x3b820a[_0x1e8991(0x159)]=_0x47ffe3=>{var _0x280982=_0x1e8991;try{_0x47ffe3&&_0x47ffe3[_0x280982(0xb9)]&&this[_0x280982(0xca)]&&JSON[_0x280982(0x101)](_0x47ffe3[_0x280982(0xb9)])['method']==='reload'&&this['global'][_0x280982(0x135)][_0x280982(0x11e)]();}catch{}};})[_0x1d7504(0xf1)](_0x4c14ea=>(this['_connected']=!0x0,this['_connecting']=!0x1,this['_allowedToConnectOnSend']=!0x1,this[_0x1d7504(0x15b)]=!0x0,this[_0x1d7504(0x161)]=0x0,_0x4c14ea))[_0x1d7504(0x97)](_0x47ecfe=>(this[_0x1d7504(0xac)]=!0x1,this[_0x1d7504(0x105)]=!0x1,console[_0x1d7504(0x134)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20'+this['_webSocketErrorDocsLink']),_0x2ad6e3(new Error(_0x1d7504(0xda)+(_0x47ecfe&&_0x47ecfe[_0x1d7504(0x125)])))));}));}['_disposeWebsocket'](_0x5b3e46){var _0x3abe90=_0x5eb929;this[_0x3abe90(0xac)]=!0x1,this[_0x3abe90(0x105)]=!0x1;try{_0x5b3e46[_0x3abe90(0x129)]=null,_0x5b3e46[_0x3abe90(0xe6)]=null,_0x5b3e46[_0x3abe90(0xf9)]=null;}catch{}try{_0x5b3e46[_0x3abe90(0x157)]<0x2&&_0x5b3e46['close']();}catch{}}[_0x5eb929(0x122)](){var _0x25ca02=_0x5eb929;clearTimeout(this[_0x25ca02(0xf3)]),!(this[_0x25ca02(0x161)]>=this[_0x25ca02(0xf8)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x425053=_0x25ca02;this['_connected']||this[_0x425053(0x105)]||(this[_0x425053(0xb6)](),this['_ws']?.[_0x425053(0x97)](()=>this[_0x425053(0x122)]()));},0x1f4),this[_0x25ca02(0xf3)][_0x25ca02(0xb1)]&&this[_0x25ca02(0xf3)][_0x25ca02(0xb1)]());}async[_0x5eb929(0x16b)](_0x53cb06){var _0x9530bd=_0x5eb929;try{if(!this[_0x9530bd(0x15b)])return;this[_0x9530bd(0x138)]&&this[_0x9530bd(0xb6)](),(await this[_0x9530bd(0x11c)])['send'](JSON[_0x9530bd(0x84)](_0x53cb06));}catch(_0x137188){console[_0x9530bd(0x134)](this[_0x9530bd(0xb2)]+':\\x20'+(_0x137188&&_0x137188[_0x9530bd(0x125)])),this['_allowedToSend']=!0x1,this[_0x9530bd(0x122)]();}}};function J(_0x29afb8,_0x5d7ea1,_0x28628c,_0x6cfe6a,_0x57aaa9,_0x1eee7a){var _0x3bb986=_0x5eb929;let _0x49ecd1=_0x28628c[_0x3bb986(0xd1)](',')[_0x3bb986(0x96)](_0x52ac76=>{var _0x39f793=_0x3bb986;try{_0x29afb8[_0x39f793(0x12f)]||((_0x57aaa9===_0x39f793(0xc2)||_0x57aaa9==='remix'||_0x57aaa9===_0x39f793(0xc9))&&(_0x57aaa9+=_0x29afb8[_0x39f793(0xaf)]?.[_0x39f793(0xbb)]?.[_0x39f793(0x140)]?'\\x20server':_0x39f793(0xfe)),_0x29afb8['_console_ninja_session']={'id':+new Date(),'tool':_0x57aaa9});let _0x17198a=new q(_0x29afb8,_0x5d7ea1,_0x52ac76,_0x6cfe6a,_0x1eee7a);return _0x17198a[_0x39f793(0x16b)][_0x39f793(0x127)](_0x17198a);}catch(_0x14f5a0){return console[_0x39f793(0x134)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x14f5a0&&_0x14f5a0[_0x39f793(0x125)]),()=>{};}});return _0x570325=>_0x49ecd1[_0x3bb986(0xb3)](_0x4cd509=>_0x4cd509(_0x570325));}function _0x3667(_0xdbb413,_0x4cd5fe){var _0x243a62=_0x243a();return _0x3667=function(_0x36670f,_0x56fb9a){_0x36670f=_0x36670f-0x82;var _0x1d76aa=_0x243a62[_0x36670f];return _0x1d76aa;},_0x3667(_0xdbb413,_0x4cd5fe);}function W(_0x4fd286){var _0x505970=_0x5eb929;let _0x14c64d=function(_0x3874fd,_0xf38f04){return _0xf38f04-_0x3874fd;},_0x501c17;if(_0x4fd286[_0x505970(0x112)])_0x501c17=function(){var _0x1c5e8c=_0x505970;return _0x4fd286[_0x1c5e8c(0x112)][_0x1c5e8c(0xd9)]();};else{if(_0x4fd286[_0x505970(0xaf)]&&_0x4fd286['process']['hrtime'])_0x501c17=function(){var _0x5ab196=_0x505970;return _0x4fd286['process'][_0x5ab196(0x124)]();},_0x14c64d=function(_0x54fa71,_0x496fe6){return 0x3e8*(_0x496fe6[0x0]-_0x54fa71[0x0])+(_0x496fe6[0x1]-_0x54fa71[0x1])/0xf4240;};else try{let {performance:_0x1f39ba}=require('perf_hooks');_0x501c17=function(){var _0x16781c=_0x505970;return _0x1f39ba[_0x16781c(0xd9)]();};}catch{_0x501c17=function(){return+new Date();};}}return{'elapsed':_0x14c64d,'timeStamp':_0x501c17,'now':()=>Date[_0x505970(0xd9)]()};}function Y(_0x6175cf,_0xb0f2ec,_0x3fbee2){var _0x3facfd=_0x5eb929;if(_0x6175cf[_0x3facfd(0xc4)]!==void 0x0)return _0x6175cf['_consoleNinjaAllowedToStart'];let _0x225a03=_0x6175cf[_0x3facfd(0xaf)]?.[_0x3facfd(0xbb)]?.['node'];return _0x225a03&&_0x3fbee2===_0x3facfd(0x10e)?_0x6175cf['_consoleNinjaAllowedToStart']=!0x1:_0x6175cf[_0x3facfd(0xc4)]=_0x225a03||!_0xb0f2ec||_0x6175cf[_0x3facfd(0x135)]?.[_0x3facfd(0xf0)]&&_0xb0f2ec[_0x3facfd(0xba)](_0x6175cf['location']['hostname']),_0x6175cf[_0x3facfd(0xc4)];}function _0x243a(){var _0x52b83f=['_setNodeExpandableState','props','_undefined','49344','next.js','_hasMapOnItsPath','_consoleNinjaAllowedToStart','_isSet','unknown','level','call','astro','_inBrowser','allStrLength','POSITIVE_INFINITY','1695064606551','name','elements','concat','split','depth',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Vinus-MacBook-Pro-C02G8ASUMD6M.local\",\"192.168.28.119\"],'unshift','positiveInfinity','_treeNodePropertiesAfterFullValue','_setNodeId','stack','now','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','timeEnd','stackTraceLimit','_setNodePermissions','indexOf','5484872UDacWB','__es'+'Module','_sortProps','sort','disabledTrace','getOwnPropertyDescriptor','path','onerror','_Symbol','error','trace','valueOf','expId','...','hits','root_exp_id','_addFunctionsNode','hostname','then','_property','_reconnectTimeout','String','getOwnPropertySymbols','5uXFfxl','array','_maxConnectAttemptCount','onopen','length','string','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','number','\\x20browser','serialize','_treeNodePropertiesBeforeFullValue','parse','145794HfbTSx','_setNodeQueryPath','Map','_connecting','create','_setNodeLabel','_addProperty','Number','_isPrimitiveWrapperType','test','sortProps','global','nuxt','Boolean','coverage','Set','performance','cappedProps','toString','match','_numberRegExp','bigint','getOwnPropertyNames','4536136EXgwzw','_hasSetOnItsPath','_isPrimitiveType','_ws','port','reload','_socket','elapsed','date','_attemptToReconnectShortly','prototype','hrtime','message','function','bind','enumerable','onclose','_p_','[object\\x20Set]','3VHvgtg','_getOwnPropertyNames','slice','_console_ninja_session','20MhWCdc','[object\\x20Date]','count','_addLoadNode','warn','location','109141sTiMBj','WebSocket','_allowedToConnectOnSend','https://tinyurl.com/37x8b79t','9869510bBSlFa','capped','replace','current','_blacklistedProperty','type','node','4qiDMHB','dockerizedApp','push','_addObjectProperty','_webSocketErrorDocsLink','_getOwnPropertySymbols','parent','url','autoExpandMaxDepth',\"/Users/newhire/.vscode/extensions/wallabyjs.console-ninja-0.0.218/node_modules\",'','reduceLimits','_capIfString','timeStamp','value','[object\\x20Array]','907313EMDpLz','ws://','12mOSGTP','1.0.0','1296144bTPSsi','object','readyState','get','onmessage','constructor','_allowedToSend','substr','127.0.0.1','defineProperty','_propertyName','noFunctions','_connectAttemptCount','_WebSocket','autoExpand','boolean','_hasSymbolPropertyOnItsPath','log','console','autoExpandPropertyCount','getPrototypeOf','_processTreeNodeResult','send','isArray','_isNegativeZero','autoExpandLimit','Symbol','_isMap','stringify','symbol','getWebSocketClass','isExpressionToEvaluate','time','_setNodeExpressionPath','host','autoExpandPreviousObjects','rootExpression','_objectToString','nodeModules','expressionsToEvaluate','_cleanNode','[object\\x20BigInt]','Buffer','getter','pop','_regExpToString','map','catch','undefined','index','_type','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','webpack','_disposeWebsocket','default','strLength','null','HTMLAllCollection','','set','_quotedRegExp','_WebSocketClass','ws/index.js','join','_dateToString','logger\\x20websocket\\x20error','disabledLog','_console_ninja','_connected','totalStrLength','_isUndefined','process','_HTMLAllCollection','unref','_sendErrorMessage','forEach','_getOwnPropertyDescriptor','toLowerCase','_connectToHostNow','setter','_additionalMetadata','data','includes','versions','_keyStrRegExp','NEGATIVE_INFINITY'];_0x243a=function(){return _0x52b83f;};return _0x243a();}function Q(_0x2ff83e,_0x36dfff,_0x1c8092,_0x4efc14){var _0x56606e=_0x5eb929;_0x2ff83e=_0x2ff83e,_0x36dfff=_0x36dfff,_0x1c8092=_0x1c8092,_0x4efc14=_0x4efc14;let _0x19fa0c=W(_0x2ff83e),_0x7ea797=_0x19fa0c['elapsed'],_0x5b7fac=_0x19fa0c['timeStamp'];class _0x29f831{constructor(){var _0x4ed111=_0x3667;this[_0x4ed111(0xbc)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x4ed111(0x116)]=/^(0|[1-9][0-9]*)$/,this[_0x4ed111(0xa4)]=/'([^\\\\']|\\\\')*'/,this[_0x4ed111(0xc0)]=_0x2ff83e[_0x4ed111(0x98)],this['_HTMLAllCollection']=_0x2ff83e[_0x4ed111(0xa1)],this[_0x4ed111(0xb4)]=Object[_0x4ed111(0xe4)],this[_0x4ed111(0x12d)]=Object[_0x4ed111(0x118)],this[_0x4ed111(0xe7)]=_0x2ff83e[_0x4ed111(0x82)],this[_0x4ed111(0x95)]=RegExp[_0x4ed111(0x123)][_0x4ed111(0x114)],this[_0x4ed111(0xa8)]=Date[_0x4ed111(0x123)][_0x4ed111(0x114)];}[_0x56606e(0xff)](_0x348cba,_0x39bee6,_0x24dd2e,_0x16fd97){var _0x590ad5=_0x56606e,_0x121c40=this,_0x404ef2=_0x24dd2e[_0x590ad5(0x163)];function _0x3d0f2c(_0x83ccee,_0x5a048b,_0x47d65b){var _0x11e262=_0x590ad5;_0x5a048b[_0x11e262(0x13f)]=_0x11e262(0xc6),_0x5a048b['error']=_0x83ccee[_0x11e262(0x125)],_0x3d65c3=_0x47d65b[_0x11e262(0x140)][_0x11e262(0x13d)],_0x47d65b[_0x11e262(0x140)][_0x11e262(0x13d)]=_0x5a048b,_0x121c40[_0x11e262(0x100)](_0x5a048b,_0x47d65b);}try{_0x24dd2e['level']++,_0x24dd2e[_0x590ad5(0x163)]&&_0x24dd2e[_0x590ad5(0x8b)][_0x590ad5(0x143)](_0x39bee6);var _0x3d851a,_0x16bec0,_0x4f8d95,_0x215ba2,_0x55cafc=[],_0x28bffd=[],_0x1a798b,_0x55d639=this['_type'](_0x39bee6),_0xdf2513=_0x55d639===_0x590ad5(0xf7),_0x294d70=!0x1,_0x5acfec=_0x55d639===_0x590ad5(0x126),_0x2611ad=this[_0x590ad5(0x11b)](_0x55d639),_0x318814=this[_0x590ad5(0x10a)](_0x55d639),_0x77eea4=_0x2611ad||_0x318814,_0x58ff65={},_0x22a485=0x0,_0x39ad3b=!0x1,_0x3d65c3,_0x52929b=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x24dd2e['depth']){if(_0xdf2513){if(_0x16bec0=_0x39bee6[_0x590ad5(0xfa)],_0x16bec0>_0x24dd2e[_0x590ad5(0xcf)]){for(_0x4f8d95=0x0,_0x215ba2=_0x24dd2e[_0x590ad5(0xcf)],_0x3d851a=_0x4f8d95;_0x3d851a<_0x215ba2;_0x3d851a++)_0x28bffd[_0x590ad5(0x143)](_0x121c40[_0x590ad5(0x108)](_0x55cafc,_0x39bee6,_0x55d639,_0x3d851a,_0x24dd2e));_0x348cba['cappedElements']=!0x0;}else{for(_0x4f8d95=0x0,_0x215ba2=_0x16bec0,_0x3d851a=_0x4f8d95;_0x3d851a<_0x215ba2;_0x3d851a++)_0x28bffd[_0x590ad5(0x143)](_0x121c40[_0x590ad5(0x108)](_0x55cafc,_0x39bee6,_0x55d639,_0x3d851a,_0x24dd2e));}_0x24dd2e[_0x590ad5(0x168)]+=_0x28bffd[_0x590ad5(0xfa)];}if(!(_0x55d639===_0x590ad5(0xa0)||_0x55d639===_0x590ad5(0x98))&&!_0x2611ad&&_0x55d639!==_0x590ad5(0xf4)&&_0x55d639!==_0x590ad5(0x92)&&_0x55d639!==_0x590ad5(0x117)){var _0x1eaea8=_0x16fd97[_0x590ad5(0xbf)]||_0x24dd2e[_0x590ad5(0xbf)];if(this['_isSet'](_0x39bee6)?(_0x3d851a=0x0,_0x39bee6['forEach'](function(_0x428809){var _0x2f3b61=_0x590ad5;if(_0x22a485++,_0x24dd2e[_0x2f3b61(0x168)]++,_0x22a485>_0x1eaea8){_0x39ad3b=!0x0;return;}if(!_0x24dd2e[_0x2f3b61(0x87)]&&_0x24dd2e[_0x2f3b61(0x163)]&&_0x24dd2e['autoExpandPropertyCount']>_0x24dd2e['autoExpandLimit']){_0x39ad3b=!0x0;return;}_0x28bffd[_0x2f3b61(0x143)](_0x121c40[_0x2f3b61(0x108)](_0x55cafc,_0x39bee6,_0x2f3b61(0x111),_0x3d851a++,_0x24dd2e,function(_0x54b3f3){return function(){return _0x54b3f3;};}(_0x428809)));})):this[_0x590ad5(0x83)](_0x39bee6)&&_0x39bee6[_0x590ad5(0xb3)](function(_0x2a600f,_0x115cc7){var _0x2b4cd7=_0x590ad5;if(_0x22a485++,_0x24dd2e[_0x2b4cd7(0x168)]++,_0x22a485>_0x1eaea8){_0x39ad3b=!0x0;return;}if(!_0x24dd2e['isExpressionToEvaluate']&&_0x24dd2e[_0x2b4cd7(0x163)]&&_0x24dd2e['autoExpandPropertyCount']>_0x24dd2e[_0x2b4cd7(0x16e)]){_0x39ad3b=!0x0;return;}var _0x408261=_0x115cc7[_0x2b4cd7(0x114)]();_0x408261[_0x2b4cd7(0xfa)]>0x64&&(_0x408261=_0x408261[_0x2b4cd7(0x12e)](0x0,0x64)+_0x2b4cd7(0xec)),_0x28bffd['push'](_0x121c40[_0x2b4cd7(0x108)](_0x55cafc,_0x39bee6,'Map',_0x408261,_0x24dd2e,function(_0x2272b0){return function(){return _0x2272b0;};}(_0x2a600f)));}),!_0x294d70){try{for(_0x1a798b in _0x39bee6)if(!(_0xdf2513&&_0x52929b[_0x590ad5(0x10b)](_0x1a798b))&&!this[_0x590ad5(0x13e)](_0x39bee6,_0x1a798b,_0x24dd2e)){if(_0x22a485++,_0x24dd2e[_0x590ad5(0x168)]++,_0x22a485>_0x1eaea8){_0x39ad3b=!0x0;break;}if(!_0x24dd2e[_0x590ad5(0x87)]&&_0x24dd2e[_0x590ad5(0x163)]&&_0x24dd2e[_0x590ad5(0x168)]>_0x24dd2e[_0x590ad5(0x16e)]){_0x39ad3b=!0x0;break;}_0x28bffd[_0x590ad5(0x143)](_0x121c40[_0x590ad5(0x144)](_0x55cafc,_0x58ff65,_0x39bee6,_0x55d639,_0x1a798b,_0x24dd2e));}}catch{}if(_0x58ff65['_p_length']=!0x0,_0x5acfec&&(_0x58ff65['_p_name']=!0x0),!_0x39ad3b){var _0x3c39a4=[]['concat'](this['_getOwnPropertyNames'](_0x39bee6))[_0x590ad5(0xd0)](this[_0x590ad5(0x146)](_0x39bee6));for(_0x3d851a=0x0,_0x16bec0=_0x3c39a4[_0x590ad5(0xfa)];_0x3d851a<_0x16bec0;_0x3d851a++)if(_0x1a798b=_0x3c39a4[_0x3d851a],!(_0xdf2513&&_0x52929b[_0x590ad5(0x10b)](_0x1a798b[_0x590ad5(0x114)]()))&&!this[_0x590ad5(0x13e)](_0x39bee6,_0x1a798b,_0x24dd2e)&&!_0x58ff65[_0x590ad5(0x12a)+_0x1a798b['toString']()]){if(_0x22a485++,_0x24dd2e['autoExpandPropertyCount']++,_0x22a485>_0x1eaea8){_0x39ad3b=!0x0;break;}if(!_0x24dd2e[_0x590ad5(0x87)]&&_0x24dd2e[_0x590ad5(0x163)]&&_0x24dd2e[_0x590ad5(0x168)]>_0x24dd2e[_0x590ad5(0x16e)]){_0x39ad3b=!0x0;break;}_0x28bffd[_0x590ad5(0x143)](_0x121c40['_addObjectProperty'](_0x55cafc,_0x58ff65,_0x39bee6,_0x55d639,_0x1a798b,_0x24dd2e));}}}}}if(_0x348cba[_0x590ad5(0x13f)]=_0x55d639,_0x77eea4?(_0x348cba[_0x590ad5(0x14f)]=_0x39bee6[_0x590ad5(0xea)](),this[_0x590ad5(0x14d)](_0x55d639,_0x348cba,_0x24dd2e,_0x16fd97)):_0x55d639==='date'?_0x348cba['value']=this[_0x590ad5(0xa8)]['call'](_0x39bee6):_0x55d639===_0x590ad5(0x117)?_0x348cba[_0x590ad5(0x14f)]=_0x39bee6[_0x590ad5(0x114)]():_0x55d639==='RegExp'?_0x348cba[_0x590ad5(0x14f)]=this[_0x590ad5(0x95)][_0x590ad5(0xc8)](_0x39bee6):_0x55d639===_0x590ad5(0x85)&&this[_0x590ad5(0xe7)]?_0x348cba[_0x590ad5(0x14f)]=this[_0x590ad5(0xe7)]['prototype'][_0x590ad5(0x114)]['call'](_0x39bee6):!_0x24dd2e['depth']&&!(_0x55d639==='null'||_0x55d639===_0x590ad5(0x98))&&(delete _0x348cba[_0x590ad5(0x14f)],_0x348cba[_0x590ad5(0x13b)]=!0x0),_0x39ad3b&&(_0x348cba[_0x590ad5(0x113)]=!0x0),_0x3d65c3=_0x24dd2e[_0x590ad5(0x140)]['current'],_0x24dd2e['node'][_0x590ad5(0x13d)]=_0x348cba,this[_0x590ad5(0x100)](_0x348cba,_0x24dd2e),_0x28bffd[_0x590ad5(0xfa)]){for(_0x3d851a=0x0,_0x16bec0=_0x28bffd[_0x590ad5(0xfa)];_0x3d851a<_0x16bec0;_0x3d851a++)_0x28bffd[_0x3d851a](_0x3d851a);}_0x55cafc[_0x590ad5(0xfa)]&&(_0x348cba['props']=_0x55cafc);}catch(_0x22e39e){_0x3d0f2c(_0x22e39e,_0x348cba,_0x24dd2e);}return this[_0x590ad5(0xb8)](_0x39bee6,_0x348cba),this['_treeNodePropertiesAfterFullValue'](_0x348cba,_0x24dd2e),_0x24dd2e[_0x590ad5(0x140)][_0x590ad5(0x13d)]=_0x3d65c3,_0x24dd2e[_0x590ad5(0xc7)]--,_0x24dd2e['autoExpand']=_0x404ef2,_0x24dd2e[_0x590ad5(0x163)]&&_0x24dd2e[_0x590ad5(0x8b)][_0x590ad5(0x94)](),_0x348cba;}[_0x56606e(0x146)](_0x27c380){var _0x263e78=_0x56606e;return Object[_0x263e78(0xf5)]?Object['getOwnPropertySymbols'](_0x27c380):[];}[_0x56606e(0xc5)](_0x474bd1){var _0x333345=_0x56606e;return!!(_0x474bd1&&_0x2ff83e[_0x333345(0x111)]&&this[_0x333345(0x8d)](_0x474bd1)===_0x333345(0x12b)&&_0x474bd1[_0x333345(0xb3)]);}[_0x56606e(0x13e)](_0x568ce8,_0x5e4518,_0x1cb6ec){var _0x3f267f=_0x56606e;return _0x1cb6ec[_0x3f267f(0x160)]?typeof _0x568ce8[_0x5e4518]==_0x3f267f(0x126):!0x1;}[_0x56606e(0x9a)](_0x55fbdf){var _0x5fe28b=_0x56606e,_0xeabbf0='';return _0xeabbf0=typeof _0x55fbdf,_0xeabbf0===_0x5fe28b(0x156)?this['_objectToString'](_0x55fbdf)===_0x5fe28b(0x150)?_0xeabbf0=_0x5fe28b(0xf7):this['_objectToString'](_0x55fbdf)===_0x5fe28b(0x131)?_0xeabbf0=_0x5fe28b(0x121):this[_0x5fe28b(0x8d)](_0x55fbdf)===_0x5fe28b(0x91)?_0xeabbf0=_0x5fe28b(0x117):_0x55fbdf===null?_0xeabbf0=_0x5fe28b(0xa0):_0x55fbdf[_0x5fe28b(0x15a)]&&(_0xeabbf0=_0x55fbdf[_0x5fe28b(0x15a)][_0x5fe28b(0xce)]||_0xeabbf0):_0xeabbf0===_0x5fe28b(0x98)&&this[_0x5fe28b(0xb0)]&&_0x55fbdf instanceof this[_0x5fe28b(0xb0)]&&(_0xeabbf0=_0x5fe28b(0xa1)),_0xeabbf0;}[_0x56606e(0x8d)](_0x22e684){var _0x1f7600=_0x56606e;return Object['prototype'][_0x1f7600(0x114)][_0x1f7600(0xc8)](_0x22e684);}[_0x56606e(0x11b)](_0x33e727){var _0x113ca8=_0x56606e;return _0x33e727===_0x113ca8(0x164)||_0x33e727==='string'||_0x33e727===_0x113ca8(0xfd);}[_0x56606e(0x10a)](_0x2fe0ea){var _0x422583=_0x56606e;return _0x2fe0ea===_0x422583(0x10f)||_0x2fe0ea===_0x422583(0xf4)||_0x2fe0ea===_0x422583(0x109);}[_0x56606e(0x108)](_0xd0a6b3,_0x2f44fb,_0x401f85,_0x436198,_0x40b6b0,_0x3300f7){var _0x258a75=this;return function(_0x156eda){var _0x4a86fd=_0x3667,_0x2adc71=_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x13d)],_0x96cd84=_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x99)],_0x230064=_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x147)];_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x147)]=_0x2adc71,_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x99)]=typeof _0x436198==_0x4a86fd(0xfd)?_0x436198:_0x156eda,_0xd0a6b3[_0x4a86fd(0x143)](_0x258a75[_0x4a86fd(0xf2)](_0x2f44fb,_0x401f85,_0x436198,_0x40b6b0,_0x3300f7)),_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x147)]=_0x230064,_0x40b6b0[_0x4a86fd(0x140)][_0x4a86fd(0x99)]=_0x96cd84;};}[_0x56606e(0x144)](_0x79198e,_0x3c793b,_0x4c82c7,_0x5da92c,_0x4b19c1,_0x3234b9,_0x1e10a8){var _0x3e8bc5=_0x56606e,_0x2ae9f3=this;return _0x3c793b[_0x3e8bc5(0x12a)+_0x4b19c1['toString']()]=!0x0,function(_0x2c3b89){var _0xb23115=_0x3e8bc5,_0x17be72=_0x3234b9[_0xb23115(0x140)][_0xb23115(0x13d)],_0x2ffef8=_0x3234b9['node'][_0xb23115(0x99)],_0x32972f=_0x3234b9[_0xb23115(0x140)]['parent'];_0x3234b9[_0xb23115(0x140)]['parent']=_0x17be72,_0x3234b9['node'][_0xb23115(0x99)]=_0x2c3b89,_0x79198e[_0xb23115(0x143)](_0x2ae9f3['_property'](_0x4c82c7,_0x5da92c,_0x4b19c1,_0x3234b9,_0x1e10a8)),_0x3234b9[_0xb23115(0x140)][_0xb23115(0x147)]=_0x32972f,_0x3234b9[_0xb23115(0x140)][_0xb23115(0x99)]=_0x2ffef8;};}[_0x56606e(0xf2)](_0x1dba95,_0x15de62,_0x154596,_0xfd9bf6,_0x13ae77){var _0x358fa4=_0x56606e,_0x3b3f10=this;_0x13ae77||(_0x13ae77=function(_0x579fa5,_0x44d149){return _0x579fa5[_0x44d149];});var _0x38743e=_0x154596['toString'](),_0x1ca09d=_0xfd9bf6[_0x358fa4(0x8f)]||{},_0x9a557=_0xfd9bf6['depth'],_0x348a88=_0xfd9bf6[_0x358fa4(0x87)];try{var _0x4e3d00=this['_isMap'](_0x1dba95),_0x44f123=_0x38743e;_0x4e3d00&&_0x44f123[0x0]==='\\x27'&&(_0x44f123=_0x44f123[_0x358fa4(0x15c)](0x1,_0x44f123['length']-0x2));var _0x337078=_0xfd9bf6['expressionsToEvaluate']=_0x1ca09d[_0x358fa4(0x12a)+_0x44f123];_0x337078&&(_0xfd9bf6[_0x358fa4(0xd2)]=_0xfd9bf6['depth']+0x1),_0xfd9bf6[_0x358fa4(0x87)]=!!_0x337078;var _0x3fbc6e=typeof _0x154596==_0x358fa4(0x85),_0x18f1b5={'name':_0x3fbc6e||_0x4e3d00?_0x38743e:this[_0x358fa4(0x15f)](_0x38743e)};if(_0x3fbc6e&&(_0x18f1b5['symbol']=!0x0),!(_0x15de62==='array'||_0x15de62==='Error')){var _0x41e068=this['_getOwnPropertyDescriptor'](_0x1dba95,_0x154596);if(_0x41e068&&(_0x41e068[_0x358fa4(0xa3)]&&(_0x18f1b5[_0x358fa4(0xb7)]=!0x0),_0x41e068[_0x358fa4(0x158)]&&!_0x337078&&!_0xfd9bf6['resolveGetters']))return _0x18f1b5[_0x358fa4(0x93)]=!0x0,this['_processTreeNodeResult'](_0x18f1b5,_0xfd9bf6),_0x18f1b5;}var _0x1709fb;try{_0x1709fb=_0x13ae77(_0x1dba95,_0x154596);}catch(_0x3fd252){return _0x18f1b5={'name':_0x38743e,'type':'unknown','error':_0x3fd252[_0x358fa4(0x125)]},this[_0x358fa4(0x16a)](_0x18f1b5,_0xfd9bf6),_0x18f1b5;}var _0x369f39=this[_0x358fa4(0x9a)](_0x1709fb),_0x5eacc1=this[_0x358fa4(0x11b)](_0x369f39);if(_0x18f1b5[_0x358fa4(0x13f)]=_0x369f39,_0x5eacc1)this[_0x358fa4(0x16a)](_0x18f1b5,_0xfd9bf6,_0x1709fb,function(){var _0x50b207=_0x358fa4;_0x18f1b5[_0x50b207(0x14f)]=_0x1709fb['valueOf'](),!_0x337078&&_0x3b3f10[_0x50b207(0x14d)](_0x369f39,_0x18f1b5,_0xfd9bf6,{});});else{var _0x3e4193=_0xfd9bf6[_0x358fa4(0x163)]&&_0xfd9bf6[_0x358fa4(0xc7)]<_0xfd9bf6[_0x358fa4(0x149)]&&_0xfd9bf6['autoExpandPreviousObjects'][_0x358fa4(0xde)](_0x1709fb)<0x0&&_0x369f39!=='function'&&_0xfd9bf6[_0x358fa4(0x168)]<_0xfd9bf6['autoExpandLimit'];_0x3e4193||_0xfd9bf6[_0x358fa4(0xc7)]<_0x9a557||_0x337078?(this[_0x358fa4(0xff)](_0x18f1b5,_0x1709fb,_0xfd9bf6,_0x337078||{}),this[_0x358fa4(0xb8)](_0x1709fb,_0x18f1b5)):this[_0x358fa4(0x16a)](_0x18f1b5,_0xfd9bf6,_0x1709fb,function(){var _0x4ddef6=_0x358fa4;_0x369f39===_0x4ddef6(0xa0)||_0x369f39===_0x4ddef6(0x98)||(delete _0x18f1b5['value'],_0x18f1b5[_0x4ddef6(0x13b)]=!0x0);});}return _0x18f1b5;}finally{_0xfd9bf6[_0x358fa4(0x8f)]=_0x1ca09d,_0xfd9bf6['depth']=_0x9a557,_0xfd9bf6[_0x358fa4(0x87)]=_0x348a88;}}[_0x56606e(0x14d)](_0x40da50,_0x34fa73,_0x4211e0,_0x46a3f9){var _0x53e4e9=_0x56606e,_0x5cc1bc=_0x46a3f9[_0x53e4e9(0x9f)]||_0x4211e0[_0x53e4e9(0x9f)];if((_0x40da50===_0x53e4e9(0xfb)||_0x40da50==='String')&&_0x34fa73[_0x53e4e9(0x14f)]){let _0x3ce399=_0x34fa73['value'][_0x53e4e9(0xfa)];_0x4211e0[_0x53e4e9(0xcb)]+=_0x3ce399,_0x4211e0[_0x53e4e9(0xcb)]>_0x4211e0[_0x53e4e9(0xad)]?(_0x34fa73[_0x53e4e9(0x13b)]='',delete _0x34fa73[_0x53e4e9(0x14f)]):_0x3ce399>_0x5cc1bc&&(_0x34fa73[_0x53e4e9(0x13b)]=_0x34fa73[_0x53e4e9(0x14f)][_0x53e4e9(0x15c)](0x0,_0x5cc1bc),delete _0x34fa73[_0x53e4e9(0x14f)]);}}[_0x56606e(0x83)](_0x3d4c44){var _0x2519dc=_0x56606e;return!!(_0x3d4c44&&_0x2ff83e[_0x2519dc(0x104)]&&this['_objectToString'](_0x3d4c44)==='[object\\x20Map]'&&_0x3d4c44['forEach']);}[_0x56606e(0x15f)](_0x220fb9){var _0x2bf696=_0x56606e;if(_0x220fb9[_0x2bf696(0x115)](/^\\d+$/))return _0x220fb9;var _0x1fa57e;try{_0x1fa57e=JSON[_0x2bf696(0x84)](''+_0x220fb9);}catch{_0x1fa57e='\\x22'+this[_0x2bf696(0x8d)](_0x220fb9)+'\\x22';}return _0x1fa57e[_0x2bf696(0x115)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x1fa57e=_0x1fa57e[_0x2bf696(0x15c)](0x1,_0x1fa57e[_0x2bf696(0xfa)]-0x2):_0x1fa57e=_0x1fa57e[_0x2bf696(0x13c)](/'/g,'\\x5c\\x27')[_0x2bf696(0x13c)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x1fa57e;}['_processTreeNodeResult'](_0x3272fa,_0x5e7dda,_0x46b118,_0x5e57d6){var _0x203b86=_0x56606e;this[_0x203b86(0x100)](_0x3272fa,_0x5e7dda),_0x5e57d6&&_0x5e57d6(),this['_additionalMetadata'](_0x46b118,_0x3272fa),this[_0x203b86(0xd6)](_0x3272fa,_0x5e7dda);}['_treeNodePropertiesBeforeFullValue'](_0x3f260e,_0x49bfd2){var _0x2690af=_0x56606e;this[_0x2690af(0xd7)](_0x3f260e,_0x49bfd2),this[_0x2690af(0x103)](_0x3f260e,_0x49bfd2),this[_0x2690af(0x89)](_0x3f260e,_0x49bfd2),this[_0x2690af(0xdd)](_0x3f260e,_0x49bfd2);}[_0x56606e(0xd7)](_0xc895c,_0x2321f5){}[_0x56606e(0x103)](_0x318a09,_0x4eb235){}[_0x56606e(0x107)](_0x3cfe06,_0xd42d09){}[_0x56606e(0xae)](_0x575fd4){var _0x4630bd=_0x56606e;return _0x575fd4===this[_0x4630bd(0xc0)];}[_0x56606e(0xd6)](_0x1bfbb4,_0x37f3e6){var _0x142246=_0x56606e;this[_0x142246(0x107)](_0x1bfbb4,_0x37f3e6),this[_0x142246(0xbe)](_0x1bfbb4),_0x37f3e6[_0x142246(0x10c)]&&this['_sortProps'](_0x1bfbb4),this[_0x142246(0xef)](_0x1bfbb4,_0x37f3e6),this['_addLoadNode'](_0x1bfbb4,_0x37f3e6),this[_0x142246(0x90)](_0x1bfbb4);}[_0x56606e(0xb8)](_0x4ee1ab,_0x5cbc28){var _0x48376a=_0x56606e;let _0x3a6723;try{_0x2ff83e[_0x48376a(0x167)]&&(_0x3a6723=_0x2ff83e[_0x48376a(0x167)]['error'],_0x2ff83e['console']['error']=function(){}),_0x4ee1ab&&typeof _0x4ee1ab[_0x48376a(0xfa)]==_0x48376a(0xfd)&&(_0x5cbc28['length']=_0x4ee1ab[_0x48376a(0xfa)]);}catch{}finally{_0x3a6723&&(_0x2ff83e[_0x48376a(0x167)][_0x48376a(0xe8)]=_0x3a6723);}if(_0x5cbc28[_0x48376a(0x13f)]===_0x48376a(0xfd)||_0x5cbc28[_0x48376a(0x13f)]===_0x48376a(0x109)){if(isNaN(_0x5cbc28[_0x48376a(0x14f)]))_0x5cbc28['nan']=!0x0,delete _0x5cbc28[_0x48376a(0x14f)];else switch(_0x5cbc28['value']){case Number[_0x48376a(0xcc)]:_0x5cbc28[_0x48376a(0xd5)]=!0x0,delete _0x5cbc28[_0x48376a(0x14f)];break;case Number['NEGATIVE_INFINITY']:_0x5cbc28['negativeInfinity']=!0x0,delete _0x5cbc28[_0x48376a(0x14f)];break;case 0x0:this['_isNegativeZero'](_0x5cbc28['value'])&&(_0x5cbc28['negativeZero']=!0x0);break;}}else _0x5cbc28[_0x48376a(0x13f)]===_0x48376a(0x126)&&typeof _0x4ee1ab[_0x48376a(0xce)]==_0x48376a(0xfb)&&_0x4ee1ab['name']&&_0x5cbc28['name']&&_0x4ee1ab[_0x48376a(0xce)]!==_0x5cbc28[_0x48376a(0xce)]&&(_0x5cbc28['funcName']=_0x4ee1ab['name']);}[_0x56606e(0x16d)](_0x28c998){var _0x58ec81=_0x56606e;return 0x1/_0x28c998===Number[_0x58ec81(0xbd)];}[_0x56606e(0xe1)](_0x2adc0a){var _0x17b229=_0x56606e;!_0x2adc0a['props']||!_0x2adc0a['props']['length']||_0x2adc0a[_0x17b229(0x13f)]==='array'||_0x2adc0a[_0x17b229(0x13f)]===_0x17b229(0x104)||_0x2adc0a[_0x17b229(0x13f)]===_0x17b229(0x111)||_0x2adc0a[_0x17b229(0xbf)][_0x17b229(0xe2)](function(_0x541c69,_0x5916a4){var _0x3afe00=_0x17b229,_0x5e72dc=_0x541c69[_0x3afe00(0xce)][_0x3afe00(0xb5)](),_0x4d8372=_0x5916a4['name']['toLowerCase']();return _0x5e72dc<_0x4d8372?-0x1:_0x5e72dc>_0x4d8372?0x1:0x0;});}['_addFunctionsNode'](_0x835ce,_0x498530){var _0x17ebb2=_0x56606e;if(!(_0x498530[_0x17ebb2(0x160)]||!_0x835ce['props']||!_0x835ce['props'][_0x17ebb2(0xfa)])){for(var _0x396fdc=[],_0x112221=[],_0x3e9672=0x0,_0x4c2f4d=_0x835ce['props']['length'];_0x3e9672<_0x4c2f4d;_0x3e9672++){var _0xb0fddf=_0x835ce[_0x17ebb2(0xbf)][_0x3e9672];_0xb0fddf[_0x17ebb2(0x13f)]===_0x17ebb2(0x126)?_0x396fdc[_0x17ebb2(0x143)](_0xb0fddf):_0x112221[_0x17ebb2(0x143)](_0xb0fddf);}if(!(!_0x112221[_0x17ebb2(0xfa)]||_0x396fdc[_0x17ebb2(0xfa)]<=0x1)){_0x835ce['props']=_0x112221;var _0x363eaa={'functionsNode':!0x0,'props':_0x396fdc};this[_0x17ebb2(0xd7)](_0x363eaa,_0x498530),this[_0x17ebb2(0x107)](_0x363eaa,_0x498530),this['_setNodeExpandableState'](_0x363eaa),this['_setNodePermissions'](_0x363eaa,_0x498530),_0x363eaa['id']+='\\x20f',_0x835ce[_0x17ebb2(0xbf)][_0x17ebb2(0xd4)](_0x363eaa);}}}[_0x56606e(0x133)](_0x9c9030,_0x43794e){}['_setNodeExpandableState'](_0x51c66a){}['_isArray'](_0x180a48){var _0x3aac40=_0x56606e;return Array[_0x3aac40(0x16c)](_0x180a48)||typeof _0x180a48=='object'&&this['_objectToString'](_0x180a48)==='[object\\x20Array]';}[_0x56606e(0xdd)](_0x2905a2,_0x42a835){}[_0x56606e(0x90)](_0x3cdcaf){var _0xc7641=_0x56606e;delete _0x3cdcaf[_0xc7641(0x165)],delete _0x3cdcaf[_0xc7641(0x11a)],delete _0x3cdcaf[_0xc7641(0xc3)];}[_0x56606e(0x89)](_0x3e1e93,_0x368b8e){}}let _0x3f8b01=new _0x29f831(),_0x2c3e4d={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x144f80={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x4491b9(_0x75c426,_0x521e9d,_0x2da2e9,_0x5dda3e,_0x1e6ac5,_0x235d43){var _0x4dd34c=_0x56606e;let _0x2cf9a1,_0x298c07;try{_0x298c07=_0x5b7fac(),_0x2cf9a1=_0x1c8092[_0x521e9d],!_0x2cf9a1||_0x298c07-_0x2cf9a1['ts']>0x1f4&&_0x2cf9a1[_0x4dd34c(0x132)]&&_0x2cf9a1[_0x4dd34c(0x88)]/_0x2cf9a1[_0x4dd34c(0x132)]<0x64?(_0x1c8092[_0x521e9d]=_0x2cf9a1={'count':0x0,'time':0x0,'ts':_0x298c07},_0x1c8092[_0x4dd34c(0xed)]={}):_0x298c07-_0x1c8092[_0x4dd34c(0xed)]['ts']>0x32&&_0x1c8092['hits'][_0x4dd34c(0x132)]&&_0x1c8092[_0x4dd34c(0xed)][_0x4dd34c(0x88)]/_0x1c8092['hits']['count']<0x64&&(_0x1c8092[_0x4dd34c(0xed)]={});let _0x3d041d=[],_0x2fa4c4=_0x2cf9a1['reduceLimits']||_0x1c8092['hits']['reduceLimits']?_0x144f80:_0x2c3e4d,_0x36b1e4=_0x64eb14=>{var _0x1d4b58=_0x4dd34c;let _0x9fa0b7={};return _0x9fa0b7[_0x1d4b58(0xbf)]=_0x64eb14[_0x1d4b58(0xbf)],_0x9fa0b7[_0x1d4b58(0xcf)]=_0x64eb14[_0x1d4b58(0xcf)],_0x9fa0b7[_0x1d4b58(0x9f)]=_0x64eb14[_0x1d4b58(0x9f)],_0x9fa0b7[_0x1d4b58(0xad)]=_0x64eb14[_0x1d4b58(0xad)],_0x9fa0b7[_0x1d4b58(0x16e)]=_0x64eb14[_0x1d4b58(0x16e)],_0x9fa0b7[_0x1d4b58(0x149)]=_0x64eb14[_0x1d4b58(0x149)],_0x9fa0b7['sortProps']=!0x1,_0x9fa0b7['noFunctions']=!_0x36dfff,_0x9fa0b7[_0x1d4b58(0xd2)]=0x1,_0x9fa0b7[_0x1d4b58(0xc7)]=0x0,_0x9fa0b7[_0x1d4b58(0xeb)]=_0x1d4b58(0xee),_0x9fa0b7[_0x1d4b58(0x8c)]='root_exp',_0x9fa0b7[_0x1d4b58(0x163)]=!0x0,_0x9fa0b7[_0x1d4b58(0x8b)]=[],_0x9fa0b7[_0x1d4b58(0x168)]=0x0,_0x9fa0b7['resolveGetters']=!0x0,_0x9fa0b7['allStrLength']=0x0,_0x9fa0b7[_0x1d4b58(0x140)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x9fa0b7;};for(var _0x511d26=0x0;_0x511d26<_0x1e6ac5[_0x4dd34c(0xfa)];_0x511d26++)_0x3d041d[_0x4dd34c(0x143)](_0x3f8b01[_0x4dd34c(0xff)]({'timeNode':_0x75c426==='time'||void 0x0},_0x1e6ac5[_0x511d26],_0x36b1e4(_0x2fa4c4),{}));if(_0x75c426==='trace'){let _0x770ac5=Error[_0x4dd34c(0xdc)];try{Error[_0x4dd34c(0xdc)]=0x1/0x0,_0x3d041d[_0x4dd34c(0x143)](_0x3f8b01[_0x4dd34c(0xff)]({'stackNode':!0x0},new Error()[_0x4dd34c(0xd8)],_0x36b1e4(_0x2fa4c4),{'strLength':0x1/0x0}));}finally{Error[_0x4dd34c(0xdc)]=_0x770ac5;}}return{'method':_0x4dd34c(0x166),'version':_0x4efc14,'args':[{'ts':_0x2da2e9,'session':_0x5dda3e,'args':_0x3d041d,'id':_0x521e9d,'context':_0x235d43}]};}catch(_0x3c53f5){return{'method':_0x4dd34c(0x166),'version':_0x4efc14,'args':[{'ts':_0x2da2e9,'session':_0x5dda3e,'args':[{'type':'unknown','error':_0x3c53f5&&_0x3c53f5[_0x4dd34c(0x125)]}],'id':_0x521e9d,'context':_0x235d43}]};}finally{try{if(_0x2cf9a1&&_0x298c07){let _0x301640=_0x5b7fac();_0x2cf9a1[_0x4dd34c(0x132)]++,_0x2cf9a1[_0x4dd34c(0x88)]+=_0x7ea797(_0x298c07,_0x301640),_0x2cf9a1['ts']=_0x301640,_0x1c8092[_0x4dd34c(0xed)][_0x4dd34c(0x132)]++,_0x1c8092[_0x4dd34c(0xed)][_0x4dd34c(0x88)]+=_0x7ea797(_0x298c07,_0x301640),_0x1c8092[_0x4dd34c(0xed)]['ts']=_0x301640,(_0x2cf9a1[_0x4dd34c(0x132)]>0x32||_0x2cf9a1[_0x4dd34c(0x88)]>0x64)&&(_0x2cf9a1['reduceLimits']=!0x0),(_0x1c8092[_0x4dd34c(0xed)]['count']>0x3e8||_0x1c8092[_0x4dd34c(0xed)][_0x4dd34c(0x88)]>0x12c)&&(_0x1c8092[_0x4dd34c(0xed)][_0x4dd34c(0x14c)]=!0x0);}}catch{}}}return _0x4491b9;}((_0x28d26b,_0x1a2856,_0x5c2bb1,_0x3a10cf,_0x3acc6e,_0xb31e8a,_0x2a68c0,_0x48bb3a,_0x562c9b,_0x350858)=>{var _0x4179c7=_0x5eb929;if(_0x28d26b[_0x4179c7(0xab)])return _0x28d26b[_0x4179c7(0xab)];if(!Y(_0x28d26b,_0x48bb3a,_0x3acc6e))return _0x28d26b[_0x4179c7(0xab)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x28d26b[_0x4179c7(0xab)];let _0x2edb16=W(_0x28d26b),_0x5ef6f2=_0x2edb16[_0x4179c7(0x120)],_0x8c0e38=_0x2edb16[_0x4179c7(0x14e)],_0x775af0=_0x2edb16['now'],_0x37ae42={'hits':{},'ts':{}},_0x271dc4=Q(_0x28d26b,_0x562c9b,_0x37ae42,_0xb31e8a),_0x40887a=_0x157c27=>{_0x37ae42['ts'][_0x157c27]=_0x8c0e38();},_0x4c7858=(_0x5e2d6e,_0xa9efb0)=>{var _0x1d804c=_0x4179c7;let _0x38224d=_0x37ae42['ts'][_0xa9efb0];if(delete _0x37ae42['ts'][_0xa9efb0],_0x38224d){let _0x4d05b1=_0x5ef6f2(_0x38224d,_0x8c0e38());_0x50bf3f(_0x271dc4(_0x1d804c(0x88),_0x5e2d6e,_0x775af0(),_0x269281,[_0x4d05b1],_0xa9efb0));}},_0x3bf854=_0x3c20a0=>_0x5e5610=>{try{_0x40887a(_0x5e5610),_0x3c20a0(_0x5e5610);}finally{_0x28d26b['console']['time']=_0x3c20a0;}},_0x41b2bd=_0x3d5bf2=>_0x249369=>{var _0x4f3838=_0x4179c7;try{let [_0x320d6d,_0x3a9fcf]=_0x249369[_0x4f3838(0xd1)](':logPointId:');_0x4c7858(_0x3a9fcf,_0x320d6d),_0x3d5bf2(_0x320d6d);}finally{_0x28d26b[_0x4f3838(0x167)][_0x4f3838(0xdb)]=_0x3d5bf2;}};_0x28d26b[_0x4179c7(0xab)]={'consoleLog':(_0x1e4a25,_0x3e9aac)=>{var _0x37ae58=_0x4179c7;_0x28d26b[_0x37ae58(0x167)][_0x37ae58(0x166)][_0x37ae58(0xce)]!==_0x37ae58(0xaa)&&_0x50bf3f(_0x271dc4('log',_0x1e4a25,_0x775af0(),_0x269281,_0x3e9aac));},'consoleTrace':(_0x2e5d66,_0x5d86a7)=>{var _0x566a51=_0x4179c7;_0x28d26b[_0x566a51(0x167)][_0x566a51(0x166)][_0x566a51(0xce)]!==_0x566a51(0xe3)&&_0x50bf3f(_0x271dc4('trace',_0x2e5d66,_0x775af0(),_0x269281,_0x5d86a7));},'consoleTime':()=>{var _0x3872be=_0x4179c7;_0x28d26b[_0x3872be(0x167)][_0x3872be(0x88)]=_0x3bf854(_0x28d26b[_0x3872be(0x167)][_0x3872be(0x88)]);},'consoleTimeEnd':()=>{var _0x46f7aa=_0x4179c7;_0x28d26b[_0x46f7aa(0x167)][_0x46f7aa(0xdb)]=_0x41b2bd(_0x28d26b[_0x46f7aa(0x167)][_0x46f7aa(0xdb)]);},'autoLog':(_0x30db6a,_0x575525)=>{_0x50bf3f(_0x271dc4('log',_0x575525,_0x775af0(),_0x269281,[_0x30db6a]));},'autoLogMany':(_0x5e2b9a,_0xc6f081)=>{var _0x50e661=_0x4179c7;_0x50bf3f(_0x271dc4(_0x50e661(0x166),_0x5e2b9a,_0x775af0(),_0x269281,_0xc6f081));},'autoTrace':(_0x45e64c,_0x44527a)=>{var _0x8b3c8c=_0x4179c7;_0x50bf3f(_0x271dc4(_0x8b3c8c(0xe9),_0x44527a,_0x775af0(),_0x269281,[_0x45e64c]));},'autoTraceMany':(_0x3f8cd0,_0x517948)=>{var _0x5e7d9c=_0x4179c7;_0x50bf3f(_0x271dc4(_0x5e7d9c(0xe9),_0x3f8cd0,_0x775af0(),_0x269281,_0x517948));},'autoTime':(_0xeef646,_0x41360b,_0x40a6da)=>{_0x40887a(_0x40a6da);},'autoTimeEnd':(_0x510f96,_0x22226b,_0x25d7cb)=>{_0x4c7858(_0x22226b,_0x25d7cb);},'coverage':_0x450634=>{var _0x35eaa9=_0x4179c7;_0x50bf3f({'method':_0x35eaa9(0x110),'version':_0xb31e8a,'args':[{'id':_0x450634}]});}};let _0x50bf3f=J(_0x28d26b,_0x1a2856,_0x5c2bb1,_0x3a10cf,_0x3acc6e,_0x350858),_0x269281=_0x28d26b[_0x4179c7(0x12f)];return _0x28d26b[_0x4179c7(0xab)];})(globalThis,_0x5eb929(0x15d),_0x5eb929(0xc1),_0x5eb929(0x14a),_0x5eb929(0x9c),_0x5eb929(0x154),_0x5eb929(0xcd),_0x5eb929(0xd3),_0x5eb929(0x14b),_0x5eb929(0xa2));");}catch(e){}};function oo_oo(i:string,...v:any[]){try{oo_cm().consoleLog(i, v);}catch(e){} return v};oo_oo;function oo_tr(i:string,...v:any[]){try{oo_cm().consoleTrace(i, v);}catch(e){} return v};oo_tr;function oo_ts(){try{oo_cm().consoleTime();}catch(e){}};oo_ts;function oo_te(){try{oo_cm().consoleTimeEnd();}catch(e){}};oo_te;/*eslint eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/