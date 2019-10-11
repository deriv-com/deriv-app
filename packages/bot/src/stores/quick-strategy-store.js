import {
    observable,
    action,
    runInAction,
}                from 'mobx';
import ApiHelper from '../services/api/api-helpers';
import config    from '../constants/index';
import { load }  from '../scratch/utils';

export default class QuickStrategyStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    initial_values = {
        symbol   : 'WLDAUD',
        tradetype: 'callput',
        stake    : '',
        size     : '',
        loss     : '',
        profit   : '',
    };

    @observable is_strategy_modal_open = false;
    @observable active_index           = 0;
    @observable market_dropdown        = {};
    @observable trade_type_dropdown    = {};

    @action.bound
    toggleStrategyModal() {
        this.is_strategy_modal_open = !this.is_strategy_modal_open;
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @action.bound
    async createStrategy(values) {
        const { contracts_for } = ApiHelper.instance;
        const {
            symbol,
            tradetype,
            stake,
            size,
            loss,
            profit,
        }                       = values;
        const market            = await contracts_for.getMarketBySymbol(symbol);
        const submarket         = await contracts_for.getSubmarketBySymbol(symbol);
        const tradetypecat      = await contracts_for.getTradeTypeCategoryByTradeType(tradetype);
        const { strategies }    = config;
        const strategy_name     = Object.keys(strategies).filter(key => strategies[key].index === this.active_index)[0];
        // eslint-disable-next-line
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
            tradetype,
            tradetypecat,
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

    @action.bound
    async onMount() {
        const { active_symbols } = ApiHelper.instance;
        const market_options     = await active_symbols.getAssetOptions();

        this.updateTradetypeDropdown();
            
        runInAction(() => {
            this.market_dropdown = market_options;
        });
    }

    @action.bound
    async updateTradetypeDropdown(symbol = this.initial_values.symbol) {
        const { contracts_for }  = ApiHelper.instance;
        const trade_type_options = await contracts_for.getGroupedTradeTypes(symbol);

        runInAction(() => {
            this.trade_type_dropdown = trade_type_options;
        });
    }

    @action.bound
    // eslint-disable-next-line
    async onChangeMarketDropdown(setFieldValue, value) {
        setFieldValue('symbol', value);
        await this.updateTradetypeDropdown(value);

        const first_option = this.trade_type_dropdown[Object.keys(this.trade_type_dropdown)[0]][0].value;
        setFieldValue('tradetype', first_option);
    }

    @action.bound
    // eslint-disable-next-line
    onChangeTradeTypeDropdown(setFieldValue, value) {
        setFieldValue('tradetype', value);
    }
}
