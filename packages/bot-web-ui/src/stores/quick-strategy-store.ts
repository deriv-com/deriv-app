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
        if (data_fields) {
            Object.keys(data_fields).forEach(data_field_key => {
                const key = data_fields[data_field_key];
                if (key.type === 'select' && this.qs_cache[key.field_name]) {
                    init[`${key.field_name}`] = this.qs_cache[key.field_name].text || '';
                } else if (this.qs_cache[key.field_name]) {
                    init[`${key.field_name}`] = this.qs_cache[key.field_name as keyof TQSCache];
                }
            });

            storeSetting('quick_strategy', this.qs_cache);
        }

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
        /* eslint-disable */ console.log(...oo_oo(`42bdd6da_0`, form_value));
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

        /* eslint-disable */ console.log(...oo_oo(`42bdd6da_1`, fields_to_update));

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
