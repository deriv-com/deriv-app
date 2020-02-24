import { computed, observable, action } from 'mobx';
import { localize } from '@deriv/translations';
import { ApiHelpers, config, load } from '@deriv/bot-skeleton';
import GTM from '../utils/gtm';

export default class QuickStrategyStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable selected_symbol = '';
    @observable selected_trade_type = '';
    @observable selected_duration_unit = '';
    @observable input_duration_value = '';
    @observable input_stake = '';
    @observable input_size = '';
    @observable input_loss = '';
    @observable input_profit = '';

    @observable is_strategy_modal_open = false;
    @observable active_index = 0;
    @observable symbol_dropdown = [];
    @observable trade_type_dropdown = [];
    @observable duration_unit_dropdown = [];

    @computed
    get initial_values() {
        return {
            'quick-strategy__symbol': this.selected_symbol && this.selected_symbol.text,
            'quick-strategy__trade-type': this.selected_trade_type && this.selected_trade_type.text,
            'quick-strategy__duration-unit': this.selected_duration_unit && this.selected_duration_unit.text,
            'quick-strategy__duration-value': this.input_duration_value,
            'quick-strategy__stake': this.input_stake,
            'quick-strategy__size': this.input_size,
            'quick-strategy__loss': this.input_loss,
            'quick-strategy__profit': this.input_profit,
        };
    }

    @computed
    get initial_errors() {
        // Persist errors through tab switch + remount.
        return this.validateQuickStrategy(this.initial_values, true);
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @action.bound
    setDurationUnitDropdown(duration_unit_options) {
        this.duration_unit_dropdown = duration_unit_options;
    }

    @action.bound
    setSymbolDropdown(symbol_options) {
        this.symbol_dropdown = symbol_options;
    }

    @action.bound
    setTradeTypeDropdown(trade_type_options) {
        this.trade_type_dropdown = trade_type_options;
    }

    @action.bound
    setSelectedDurationUnit(duration_unit) {
        this.selected_duration_unit = duration_unit;
    }

    @action.bound
    setSelectedSymbol(symbol) {
        this.selected_symbol = symbol;
    }

    @action.bound
    setSelectedTradeType(trade_type) {
        this.selected_trade_type = trade_type;
    }

    @action.bound
    setDurationInputValue(duration_value) {
        this.input_duration_value = duration_value;
    }

    @action.bound
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

    @action.bound
    onChangeInputValue(field, event) {
        this[field] = event.currentTarget.value;
    }

    @action.bound
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

    @action.bound
    onScrollStopDropdownList(type) {
        GTM.pushDataLayer({ event: `dbot_quick_strategy_scroll_${type}` });
    }

    @action.bound
    async toggleStrategyModal() {
        this.root_store.flyout.setVisibility(false);
        this.is_strategy_modal_open = !this.is_strategy_modal_open;

        if (this.is_strategy_modal_open) {
            await this.updateSymbolDropdown();
        }
    }

    @action.bound
    async createStrategy({ button }) {
        const symbol = this.selected_symbol.value;
        const trade_type = this.selected_trade_type.value;
        const duration_unit = this.selected_duration_unit.value;
        const duration_value = this.input_duration_value;
        const stake = this.input_stake;
        const size = this.input_size;
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

        load(Blockly.Xml.domToText(strategy_dom));

        if (button === 'run') {
            const workspace = Blockly.derivWorkspace;
            const trade_definition_block = workspace.getTradeDefinitionBlock();

            workspace.waitForBlockEvent(trade_definition_block.id, Blockly.Events.BLOCK_CREATE).then(() => {
                this.toggleStrategyModal();
                this.root_store.run_panel.onRunButtonClick();
            });
        } else {
            this.toggleStrategyModal();
        }
    }

    @action.bound
    async updateSymbolDropdown() {
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getAllSymbols();
        const symbol_options = symbols.map(symbol => ({
            group: symbol.submarket_display,
            text: symbol.symbol_display,
            value: symbol.symbol,
        }));

        this.setSymbolDropdown(symbol_options);

        if (!this.selected_symbol && symbol_options.length) {
            this.selected_symbol = symbol_options[0];
            await this.updateTradeTypeDropdown(this.selected_symbol.value);
        }
    }

    @action.bound
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

                // TODO: Render extra inputs for barrier + prediction types.
                if (!has_barrier && !has_prediction) {
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
        const first_trade_type = trade_type_options[0];

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

    @action.bound
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
        const first_duration_unit = duration_options[0];

        if (first_duration_unit) {
            this.setSelectedDurationUnit(first_duration_unit);
            this.updateDurationValue(this.selected_duration_unit.value, setFieldValue);

            if (setFieldValue) {
                setFieldValue('quick-strategy__duration-unit', first_duration_unit.text);
            }
        }
    }

    @action.bound
    async updateDurationValue(duration_type, setFieldValue) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(this.selected_symbol.value, this.selected_trade_type.value);
        const min_duration = durations.find(duration => duration.unit === duration_type);

        if (min_duration) {
            this.setDurationInputValue(min_duration.min);

            if (setFieldValue) {
                setFieldValue('quick-strategy__duration-value', min_duration.min);
            }
        }
    }

    @action.bound
    validateQuickStrategy(values, should_ignore_empty = false) {
        const errors = {};
        const number_fields = [
            'quick-strategy__duration-value',
            'quick-strategy__stake',
            'quick-strategy__size',
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

    getSizeDesc = index => {
        switch (index) {
            case 0:
                return localize('The multiplier amount used to increase your stake if you’re losing a trade.');
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
}
