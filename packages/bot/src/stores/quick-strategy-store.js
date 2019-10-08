import {
    observable,
    action,
    runInAction,
}                from 'mobx';
import ApiHelper from '../services/api/api-helpers';

export default class QuickStrategyStore {
    constructor(root_store) {
        this.root_store = root_store;

    }

    @observable initial_values = {
        assets    : 'frxXAGUSD',
        trade_type: 'callputequal',
        stake     : 0,
        size      : 2,
        max_loss  : 300,
        max_profit: 300,
    };

    @observable is_strategy_modal_open = false;
    @observable active_index = 0;
    @observable market_dropdown = [];
    @observable tradetype_dropdown = [];
    // @observable strategy = 'martingale';

    // updateStrategy = async () => {
    //     const workspace = Blockly.mainWorkspace;
    //     const strategy_xml = await fetch(`dist/${this.strategy}.xml`).then(response => response.text());
    //     const strategy_dom = Blockly.Xml.textToDom(strategy_xml);

    //     const modifiedValue = (key, value) => {
    //         const value_block = strategy_dom.querySelector(`value[id="${key}_value"]`);

    //         if (value_block){
    //             value_block.innerHTML = `<block type="math_number"><field name="NUM">${value}</field></block>`;
    //         }
    //     };

    //     const modifiedDropdownValue = (name, value) => {
    //         const block = strategy_dom.querySelector(`field[name="${`${name.toUpperCase()  }_LIST`}"]`);

    //         if (block){
    //             block.innerHTML = value;
    //         }
    //     };

    //     Object.keys(this.trade_options).forEach(key => {
    //         const value = this.trade_options[key];

    //         if (!isNaN(value)){
    //             modifiedValue(key, value);
    //         } else if (typeof value === 'string'){
    //             modifiedDropdownValue(key, value);
    //         }
    //     });

    //     /* const dropdowns = {
    //         MARKET_LIST: 'market',
    //         TYPE_LIST  : 'contract',
    //     };
    //     const fields = ['stake', 'size', 'loss', 'profit'];

    //     Object.keys(dropdowns).forEach(key => modifiedDropdownValue(key, dropdowns[key]));
    //     fields.forEach(field => modifiedValue(field)); */

    //     workspace.clear();
    //     Blockly.Xml.domToWorkspace(strategy_dom, workspace);
    // }

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
    createStrategy(values) {
        console.log(values); // eslint-disable-line
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
    async updateTradetypeDropdown(symbol = this.initial_values.assets) {
        const { contracts_for } = ApiHelper.instance;
        const tradetype_options = await contracts_for.getTradeTypeBySymbol(symbol);

        this.tradetype_dropdown = tradetype_options;
    }

    @action.bound
    // eslint-disable-next-line
    onChangeMarketDropdown(setFieldValue, value) {
        setFieldValue('assets', value);
        this.updateTradetypeDropdown(value);
    }

    @action.bound
    // eslint-disable-next-line
    onChangeTradeTypeDropdown(setFieldValue, value) {
        setFieldValue('trade_type', value);
    }

    // @action.bound
    // setTradeOption = (name, value) => {
    //     this.trade_options[name] = value;
    // };
}
