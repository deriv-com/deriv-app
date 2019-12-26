
import {
    observable,
    action,
    runInAction,
}                    from 'mobx';
import { localize }  from 'deriv-translations';
import config        from '../constants/index';
import { load }      from '../scratch/utils';
import ApiHelpers     from '../services/api/api-helpers';

export default class QuickStrategyStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    initial_values = {
        symbol       : 'WLDAUD',
        trade_type   : 'callput',
        duration_type: 't',
        duration     : 5,
        stake        : '',
        size         : '',
        loss         : '',
        profit       : '',
    };

    @observable is_strategy_modal_open = false;
    @observable active_index           = 0;
    @observable market_dropdown        = {};
    @observable trade_type_dropdown    = {};
    @observable duration_dropdown      = [];

    @action.bound
    toggleStrategyModal() {
        this.root_store.flyout.setVisibility(false);
        this.is_strategy_modal_open = !this.is_strategy_modal_open;

        if (this.is_strategy_modal_open) {
            this.onModalOpen();
        }
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @action.bound
    async createStrategy(values) {
        const { contracts_for } = ApiHelpers.instance;
        const {
            symbol,
            trade_type,
            duration_type,
            duration,
            stake,
            size,
            loss,
            profit,
        }                       = values;
        const market            = await contracts_for.getMarketBySymbol(symbol);
        const submarket         = await contracts_for.getSubmarketBySymbol(symbol);
        const trade_type_cat    = await contracts_for.getTradeTypeCategoryByTradeType(trade_type);
        const { strategies }    = config;
        const strategy_name     = Object.keys(strategies).filter(key => strategies[key].index === this.active_index)[0];
        const strategy_xml      = await fetch(`${__webpack_public_path__}xml/${strategy_name}.xml`).then(response => response.text());
        const strategy_dom      = Blockly.Xml.textToDom(strategy_xml);

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
            tradetype   : trade_type,
            tradetypecat: trade_type_cat,
            durationtype: duration_type,
            duration,
            stake,
            size,
            loss,
            profit,
        };

        Object.keys(fields_to_update).forEach(key => {
            const value = fields_to_update[key];

            if (!isNaN(value)){
                modifyValueInputs(key, value);
            } else if (typeof value === 'string'){
                modifyFieldDropdownValues(key, value);
            }
        });

        load(Blockly.Xml.domToText(strategy_dom));
        this.toggleStrategyModal();
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

    validateQuickStrategy = values => {
        const errors = {};
        const number_field = ['duration', 'stake', 'size', 'profit', 'loss'];
    
        Object.keys(values).forEach(key => {
            const value = values[key];
    
            if (number_field.includes(key)){
                if (isNaN(value)) {
                    errors[key] = localize('Must be a number');
                } else if (value <= 0){
                    errors[key] = localize('Must be a number higher than 0');
                } else if (/^0+(?=\d)/.test(value)) {
                    errors[key] = localize('Invalid number format');
                }
            }
    
            if (value === '') {
                errors[key] = localize('Field cannot be empty');
            }
        });

        const { min, max } = this.duration_dropdown.filter(duration => duration.unit === values.duration_type)[0];
        if (values.duration < min) {
            errors.duration = `${localize('Minimum duration:')} ${min}`;
        } else if (values.duration > max) {
            errors.duration = `${localize('Maximum duration:')} ${max}`;
        }
    
        return errors;
    };

    @action.bound
    async onModalOpen() {
        const { active_symbols } = ApiHelpers.instance;
        const market_options     = await active_symbols.getAssetOptions();

        await this.updateTradetypeDropdown();
        await this.updateDurationDropdown();
        await this.updateDurationValue();
            
        runInAction(() => {
            this.market_dropdown = market_options;
        });
    }

    @action.bound
    // eslint-disable-next-line
    async onChangeMarketDropdown(setFieldValue, value) {
        setFieldValue('symbol', value);
        await this.updateTradetypeDropdown(setFieldValue, value);

        const first_trade_type_option = this.trade_type_dropdown[Object.keys(this.trade_type_dropdown)[0]][0].value;

        setFieldValue('trade_type', first_trade_type_option);
    }

    @action.bound
    async updateTradetypeDropdown(setFieldValue = null, symbol = this.initial_values.symbol) {
        const { contracts_for }  = ApiHelpers.instance;
        const trade_type_options = await contracts_for.getGroupedTradeTypes(symbol);
        const first_trade_type_option = trade_type_options[Object.keys(trade_type_options)[0]][0].value;

        runInAction(() => this.trade_type_dropdown = trade_type_options);

        if (setFieldValue) {
            setFieldValue('trade_type', first_trade_type_option);
    
            await this.updateDurationDropdown(setFieldValue, symbol, first_trade_type_option);
        }
    }

    @action.bound
    // eslint-disable-next-line
    async onChangeTradeTypeDropdown(setFieldValue, symbol, trade_type) {
        setFieldValue('trade_type', trade_type);

        await this.updateDurationDropdown(setFieldValue, symbol, trade_type);
    }

    @action.bound
    async updateDurationDropdown(
        setFieldValue = null,
        symbol = this.initial_values.symbol,
        trade_type = this.initial_values.trade_type
    ) {
        const { contracts_for } = ApiHelpers.instance;
        const durations = await contracts_for.getDurations(symbol, trade_type);
        const first_duration_option = durations[Object.keys(durations)[0]].unit;

        runInAction(() => this.duration_dropdown = durations);

        if (setFieldValue) {
            setFieldValue('duration_type', first_duration_option);
    
            this.updateDurationValue(setFieldValue, first_duration_option);
        }
    }

    @action.bound
    // eslint-disable-next-line
    async onChangeDurationDropdown(setFieldValue, duration_type) {
        setFieldValue('duration_type', duration_type);

        this.updateDurationValue(setFieldValue, duration_type);
    }

    @action.bound
    async updateDurationValue(
        setFieldValue = null,
        duration_type = this.initial_values.duration_type
    ) {
        const min_duration = this.duration_dropdown.filter(duration => duration.unit === duration_type)[0].min;

        if (setFieldValue) {
            setFieldValue('duration', min_duration);
        }
    }
}
