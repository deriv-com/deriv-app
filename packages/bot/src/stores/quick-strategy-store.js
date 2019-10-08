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

    @observable initial_values = {
        symbol   : 'frxAUDJPY',
        tradetype: 'callput',
        stake    : 100,
        size     : 2,
        loss     : 300,
        profit   : 400,
    };

    @observable is_strategy_modal_open = false;
    @observable active_index = 0;
    @observable market_dropdown = [];
    @observable tradetype_dropdown = [];

    @action.bound
    toggleStrategyModal = () => {
        this.is_strategy_modal_open = !this.is_strategy_modal_open;
    };

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;
    }

    @action.bound
    // eslint-disable-next-line
    async createStrategy(values) {
        const { contracts_for } = ApiHelper.instance;
        const { symbol, tradetype } = values;
        const { market, submarket } = await contracts_for.getMarketAndSubmarketBySymbol(symbol);
        const tradetypecat = await contracts_for.getTradeTypeCategoryByTradeType(tradetype);
        const { strategies } = config;
        const strategy_name = Object.keys(strategies).filter(key => strategies[key].index === this.active_index)[0];
        // eslint-disable-next-line
        const strategy_xml = await fetch(`${__webpack_public_path__}xml/${strategy_name}.xml`).then(response => response.text());
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml);

        const modifiedValue = (key, value) => {
            const value_block = strategy_dom.querySelector(`value[id="${key}_value"]`);

            if (value_block){
                value_block.innerHTML = `<block type="math_number"><field name="NUM">${value}</field></block>`;
            }
        };

        const modifiedDropdownValue = (name, value) => {
            const block = strategy_dom.querySelector(`field[name="${`${name.toUpperCase()}_LIST`}"]`);

            if (block){
                block.innerHTML = value;
            }
        };

        const field_values = {
            ...values,
            market,
            submarket,
            tradetypecat,
        };

        Object.keys(field_values).forEach(key => {
            const value = field_values[key];

            if (!isNaN(value)){
                modifiedValue(key, value);
            } else if (typeof value === 'string'){
                modifiedDropdownValue(key, value);
            }
        });

        load(Blockly.Xml.domToText(strategy_dom));
        this.toggleStrategyModal();
    }

    @action.bound
    async quickStrategyDidMount() {
        const { active_symbols } = ApiHelper.instance;
        const market_options = await active_symbols.getAllMarketDropdownOptions();
        this.updateTradetypeDropdown();
            
        runInAction(() => {
            this.market_dropdown = market_options;
        });
    }

    @action.bound
    async updateTradetypeDropdown(symbol = this.initial_values.symbol) {
        const { contracts_for } = ApiHelper.instance;
        const tradetype_options = await contracts_for.getTradeTypeBySymbol(symbol);

        runInAction(() => {
            this.tradetype_dropdown = tradetype_options;
        });
    }

    @action.bound
    // eslint-disable-next-line
    async onChangeMarketDropdown(setFieldValue, value) {
        setFieldValue('symbol', value);
        await this.updateTradetypeDropdown(value);

        const first_option = this.tradetype_dropdown[Object.keys(this.tradetype_dropdown)[0]][0].value;
        setFieldValue('tradetype', first_option);
    }

    @action.bound
    // eslint-disable-next-line
    onChangeTradeTypeDropdown(setFieldValue, value) {
        setFieldValue('tradetype', value);
    }
}
