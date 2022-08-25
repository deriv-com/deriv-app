import { computed, observable, action, runInAction, makeObservable } from 'mobx';
import { localize } from '@deriv/translations';
import { ApiHelpers, config, load } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import GTM from 'Utils/gtm';
import { storeSetting, getSetting } from 'Utils/settings';

export default class QuickStrategyStore {
    constructor(root_store) {
        makeObservable(this, {
            selected_symbol: observable,
            selected_trade_type: observable,
            selected_duration_unit: observable,
            input_duration_value: observable,
            input_stake: observable,
            input_size: observable,
            input_alembert_unit: observable,
            input_oscar_unit: observable,
            input_loss: observable,
            input_profit: observable,
            is_strategy_modal_open: observable,
            active_index: observable,
            symbol_dropdown: observable,
            trade_type_dropdown: observable,
            duration_unit_dropdown: observable,
            initial_values: computed,
            initial_errors: computed,
            setActiveTabIndex: action.bound,
            setDurationUnitDropdown: action.bound,
            setSymbolDropdown: action.bound,
            setTradeTypeDropdown: action.bound,
            setSelectedDurationUnit: action.bound,
            setSelectedSymbol: action.bound,
            setSelectedTradeType: action.bound,
            setDurationInputValue: action.bound,
            onChangeDropdownItem: action.bound,
            onChangeInputValue: action.bound,
            onHideDropdownList: action.bound,
            toggleStrategyModal: action.bound,
            createStrategy: action.bound,
            updateSymbolDropdown: action.bound,
            updateTradeTypeDropdown: action.bound,
            updateDurationDropdown: action.bound,
            updateDurationValue: action.bound,
            validateQuickStrategy: action.bound,
        });

        this.root_store = root_store;
        this.qs_cache = getSetting('quick_strategy') || {};
    }
    selected_symbol = this.qs_cache?.selected_symbol || '';
    selected_trade_type = this.qs_cache?.selected_trade_type || '';
    selected_duration_unit = this.qs_cache?.selected_duration_unit || '';
    input_duration_value = this.qs_cache?.input_duration_value || '';
    input_stake = this.qs_cache?.input_stake || '';
    input_size = this.qs_cache?.input_size || '';
    input_alembert_unit = this.qs_cache?.input_alembert_unit || '';
    input_oscar_unit = this.qs_cache?.input_oscar_unit || '';
    input_loss = this.qs_cache?.input_loss || '';
    input_profit = this.qs_cache?.input_profit || '';

    is_strategy_modal_open = false;
    active_index = 0;
    symbol_dropdown = [];
    trade_type_dropdown = [];
    duration_unit_dropdown = [];

    get initial_values() {
        const init = {
            'quick-strategy__symbol': this.getFieldValue(this.symbol_dropdown, this.selected_symbol.value) || '',
            'quick-strategy__trade-type':
                this.getFieldValue(this.trade_type_dropdown, this.selected_trade_type.value) || '',
            'quick-strategy__duration-unit':
                this.getFieldValue(this.duration_unit_dropdown, this.selected_duration_unit.value) || '',
            'quick-strategy__duration-value': this.input_duration_value || '',
            'quick-strategy__stake': this.input_stake,
            ...(this.active_index === 0 && { 'quick-strategy__size': this.input_size }),
            ...(this.active_index === 1 && { 'alembert-unit': this.input_alembert_unit }),
            ...(this.active_index === 2 && { 'oscar-unit': this.input_oscar_unit }),

            'quick-strategy__loss': this.input_loss,
            'quick-strategy__profit': this.input_profit,
        };
        storeSetting('quick_strategy', this.qs_cache);

        return init;
    }

    get initial_errors() {
        // Persist errors through tab switch + remount.
        return this.validateQuickStrategy(this.initial_values, true);
    }

    setActiveTabIndex(index) {
        this.active_index = index;
    }

    setDurationUnitDropdown(duration_unit_options) {
        this.duration_unit_dropdown = duration_unit_options;
    }

    setSymbolDropdown(symbol_options) {
        this.symbol_dropdown = symbol_options;
    }

    setTradeTypeDropdown(trade_type_options) {
        this.trade_type_dropdown = trade_type_options;
    }

    setSelectedDurationUnit(duration_unit) {
        this.qs_cache.selected_duration_unit = duration_unit;
        this.selected_duration_unit = duration_unit;
    }

    setSelectedSymbol(symbol) {
        this.qs_cache.selected_symbol = symbol;
        this.selected_symbol = symbol;
        delete this.qs_cache?.selected_duration_unit;
        delete this.qs_cache?.duration_value;
        delete this.qs_cache?.selected_trade_type;
    }

    setSelectedTradeType(trade_type) {
        this.qs_cache.selected_trade_type = trade_type;
        this.selected_trade_type = trade_type;
        delete this.qs_cache?.selected_duration_unit;
        delete this.qs_cache?.duration_value;
    }

    setDurationInputValue(duration_value) {
        this.qs_cache.input_duration_value = duration_value;
        this.input_duration_value = duration_value;
    }

    onChangeDropdownItem(type, value, setFieldValue) {
        if (!value) {
            return;
        }

        const field_map = this.getFieldMap(type);
        if (type === 'symbol') {
            this.updateTradeTypeDropdown(value, setFieldValue);

            const symbol = this.symbol_dropdown.find(item => item.value === value);
            this.setSelectedSymbol(symbol);

            if (symbol) {
                setFieldValue(field_map.field_name, symbol.text);
            }
        } else if (type === 'trade-type') {
            this.updateDurationDropdown(this.selected_symbol.value, value, setFieldValue);

            const trade_type = this.trade_type_dropdown.find(item => item.value === value);
            this.setSelectedTradeType(trade_type);

            if (trade_type) {
                setFieldValue(field_map.field_name, trade_type.text);
            }
        } else if (type === 'duration-unit') {
            this.updateDurationValue(value, setFieldValue);

            const duration_unit = this.duration_unit_dropdown.find(item => item.value === value);
            this.setSelectedDurationUnit(duration_unit);

            if (duration_unit) {
                setFieldValue('quick-strategy__duration-unit', duration_unit.text);
            }
        }
    }

    onChangeInputValue(field, event) {
        this.qs_cache[field] = event.currentTarget.value;
        this[field] = event.currentTarget.value;
        storeSetting('quick_strategy', this.qs_cache);
    }

    onHideDropdownList(type, value, setFieldValue) {
        const field_map = this.getFieldMap(type);
        const item = field_map.dropdown.find(i => i.text.toLowerCase() === value.toLowerCase()) || field_map.selected;

        // Don't allow bogus input.
        if (!item) {
            setFieldValue(field_map.field_name, '');
            return;
        }
        // Restore value if user closed list.
        if (item.text !== value) {
            setFieldValue(field_map.field_name, item.text);
        }
        // Update item if different item was typed.
        if (item !== field_map.selected) {
            field_map.setSelected(item);
        }
    }

    async toggleStrategyModal() {
        this.root_store.flyout.setVisibility(false);
        this.is_strategy_modal_open = !this.is_strategy_modal_open;

        if (this.is_strategy_modal_open) {
            await this.updateSymbolDropdown();
        }
    }

    async createStrategy({ button }) {
        const symbol = this.selected_symbol.value;
        const trade_type = this.selected_trade_type.value;
        const duration_unit = this.selected_duration_unit.value;
        const duration_value = this.input_duration_value;
        const stake = this.input_stake;
        const size = this.input_size;
        const alembert_unit = this.input_alembert_unit;
        const oscar_unit = this.input_oscar_unit;
        const loss = this.input_loss;
        const profit = this.input_profit;

        const { contracts_for } = ApiHelpers.instance;
        const market = await contracts_for.getMarketBySymbol(symbol);
        const submarket = await contracts_for.getSubmarketBySymbol(symbol);
        const trade_type_cat = await contracts_for.getTradeTypeCategoryByTradeType(trade_type);

        const { strategies } = config;
        const strategy_name = Object.keys(strategies).find(s => strategies[s].index === this.active_index);
        const strategy_xml = await import(/* webpackChunkName: `[request]` */ `../xml/${strategy_name}.xml`);
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml.default);

        const modifyValueInputs = (key, value) => {
            const el_value_inputs = strategy_dom.querySelectorAll(`value[strategy_value="${key}"]`);

            el_value_inputs.forEach(el_value_input => {
                el_value_input.innerHTML = `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
            });
        };

        const modifyFieldDropdownValues = (name, value) => {
            const el_blocks = strategy_dom.querySelectorAll(`field[name="${`${name.toUpperCase()}_LIST`}"]`);

            el_blocks.forEach(el_block => {
                el_block.innerHTML = value;
            });
        };

        const fields_to_update = {
            market,
            submarket,
            symbol,
            tradetype: trade_type,
            tradetypecat: trade_type_cat,
            durationtype: duration_unit,
            duration: duration_value,
            stake,
            size,
            alembert_unit,
            oscar_unit,
            loss,
            profit,
        };

        Object.keys(fields_to_update).forEach(key => {
            const value = fields_to_update[key];

            if (!isNaN(value)) {
                modifyValueInputs(key, value);
            } else if (typeof value === 'string') {
                modifyFieldDropdownValues(key, value);
            }
        });

        const file_name = strategies?.[strategy_name]?.label || localize('Unknown');
        const { derivWorkspace: workspace } = Blockly;

        load({ block_string: Blockly.Xml.domToText(strategy_dom), file_name, workspace, from: save_types.UNSAVED });

        if (button === 'run') {
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
            this.toggleStrategyModal();
        }
    }

    async updateSymbolDropdown() {
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getAllSymbols(/* should_be_open */ true);
        const symbol_options = symbols.map(symbol => ({
            group: symbol.submarket_display,
            text: symbol.symbol_display,
            value: symbol.symbol,
        }));

        this.setSymbolDropdown(symbol_options);

        if (!this.selected_symbol && symbol_options.length) {
            this.selected_symbol = symbol_options[0];
        }
        await this.updateTradeTypeDropdown(this.selected_symbol.value);
    }

    async updateTradeTypeDropdown(symbol, setFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const trade_type_options = [];
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

            trade_types.forEach(trade_type => {
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
        }

        this.setTradeTypeDropdown(trade_type_options);
        let first_trade_type = trade_type_options[0];

        if (this.selected_trade_type && trade_type_options.some(e => e.value === this.selected_trade_type.value)) {
            first_trade_type = this.selected_trade_type;
            runInAction(() => {
                first_trade_type.text = this.getFieldValue(this.trade_type_dropdown, this.selected_trade_type.value);
            });
        } else {
            delete this.qs_cache?.selected_trade_type;
        }
        if (first_trade_type) {
            this.setSelectedTradeType(first_trade_type);
            await this.updateDurationDropdown(
                this.selected_symbol.value,
                this.selected_trade_type.value,
                setFieldValue
            );

            if (setFieldValue) {
                setFieldValue('quick-strategy__trade-type', first_trade_type.text);
            }
        }
    }

    async updateDurationDropdown(symbol, trade_type, setFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(symbol, trade_type);
        const duration_options = durations.map(duration => ({
            text: duration.display,
            value: duration.unit,
            min: duration.min,
            max: duration.max,
        }));
        this.setDurationUnitDropdown(duration_options);
        let first_duration_unit = duration_options[0];
        if (this.selected_duration_unit && duration_options.some(e => e.value === this.selected_duration_unit.value)) {
            first_duration_unit = this.selected_duration_unit;
            runInAction(() => {
                first_duration_unit.text = this.getFieldValue(duration_options, this.selected_duration_unit.value);
            });
        } else {
            delete this.qs_cache?.selected_duration_unit;
        }
        if (first_duration_unit) {
            this.setSelectedDurationUnit(first_duration_unit);
            this.updateDurationValue(this.selected_duration_unit.value, setFieldValue);

            if (setFieldValue) {
                setFieldValue('quick-strategy__duration-unit', first_duration_unit.text);
            }
        }
    }

    async updateDurationValue(duration_type, setFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(this.selected_symbol.value, this.selected_trade_type.value);
        const min_duration = durations.find(duration => duration.unit === duration_type);
        if (min_duration) {
            let duration_input_value = min_duration.min;
            const cache_unit = this.qs_cache?.input_duration_value;
            if (cache_unit && cache_unit < min_duration.max && cache_unit > min_duration.min) {
                duration_input_value = cache_unit;
            } else {
                delete this.qs_cache?.input_duration_value;
            }
            this.setDurationInputValue(duration_input_value);

            if (setFieldValue) {
                setFieldValue('quick-strategy__duration-value', duration_input_value);
            }
        }
    }

    validateQuickStrategy(values, should_ignore_empty = false) {
        const errors = {};
        const number_fields = [
            'quick-strategy__duration-value',
            'quick-strategy__stake',
            ...(this.active_index === 0 ? ['quick-strategy__size'] : []),
            ...(this.active_index === 1 ? ['alembert-unit'] : []),
            ...(this.active_index === 2 ? ['oscar-unit'] : []),
            'quick-strategy__profit',
            'quick-strategy__loss',
        ];
        Object.keys(values).forEach(key => {
            const value = values[key];

            if (should_ignore_empty && !value) {
                return;
            }

            if (number_fields.includes(key)) {
                if (isNaN(value)) {
                    errors[key] = localize('Must be a number');
                } else if (value <= 0) {
                    errors[key] = localize('Must be a number higher than 0');
                } else if (/^0+(?=\d)/.test(value)) {
                    errors[key] = localize('Invalid number format');
                }
            }

            if (value === '') {
                errors[key] = localize('Field cannot be empty');
            }
            if (key === 'quick-strategy__size' && values[key] < 2) {
                errors[key] = localize('Value must be higher than 2');
            }
        });

        const duration = this.duration_unit_dropdown.find(d => d.text === values['quick-strategy__duration-unit']);

        if (duration) {
            const { min, max } = duration;

            if (values['quick-strategy__duration-value'] < min) {
                errors['quick-strategy__duration-value'] = localize('Minimum duration: {{ min }}', { min });
            } else if (values['quick-strategy__duration-value'] > max) {
                errors['quick-strategy__duration-value'] = localize('Maximum duration: {{ max }}', { max });
            }
        }
        return errors;
    }

    onScrollStopDropdownList = type => {
        GTM.pushDataLayer({ event: `dbot_quick_strategy_scroll_${type}` });
    };

    getSizeDesc = index => {
        switch (index) {
            case 0:
                return localize(
                    'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.'
                );
            case 1:
                return localize('The amount that you may add to your stake if you’re losing a trade.');
            case 2:
                return localize('The amount that you may add to your stake after each successful trade.');
            default:
                return '';
        }
    };

    getSizeText = index => {
        switch (index) {
            case 0:
                return localize('Size');
            case 1:
            case 2:
                return localize('Units');
            default:
                return '';
        }
    };

    getFieldMap = type => {
        const field_mapping = {
            symbol: {
                field_name: 'quick-strategy__symbol',
                dropdown: this.symbol_dropdown,
                selected: this.selected_symbol,
                setSelected: this.setSelectedSymbol,
            },
            'trade-type': {
                field_name: 'quick-strategy__trade-type',
                dropdown: this.trade_type_dropdown,
                selected: this.selected_trade_type,
                setSelected: this.setSelectedTradeType,
            },
            'duration-unit': {
                field_name: 'quick-strategy__duration-unit',
                dropdown: this.duration_unit_dropdown,
                selected: this.selected_duration_unit,
                setSelected: this.setSelectedDurationUnit,
            },
        };
        return field_mapping[type];
    };

    getFieldValue = (list_items, value) => {
        const dropdown_items = Array.isArray(list_items) ? list_items : [].concat(...Object.values(list_items));
        const list_obj = dropdown_items.find(item =>
            typeof item.value !== 'string' ? item.value === value : item.value?.toLowerCase() === value?.toLowerCase()
        );

        return list_obj?.text || '';
    };
}
