import { observable, action, computed } from 'mobx';

export default class TutorialStore {
    @observable show_again = true;
    @observable modal_is_open = true;
    @observable strategy = 'martingale';
    @observable trade_options = {
        market  : 'm1',
        contract: 'c1',
        stake   : 0,
        size    : 0,
        loss    : 0,
        profit  : 0,
    };

    constructor() {
        const starter_hint = localStorage.getItem('StarterHint');
        this.show_again = starter_hint === null ? true : starter_hint;
        this.modal_is_open = this.show_again;
    }

    updateStrategy = async () => {
        const workspace = Blockly.mainWorkspace;
        const strategy_xml = await fetch(`dist/${this.strategy}.xml`).then(response => response.text());
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml);

        const modifiedValue = type => {
            const value_block = strategy_dom.querySelector(`value[id="${type}_value"]`);

            value_block.innerHTML = `<block type="math_number"><field name="NUM">${this.trade_options[type]}</field></block>`;
        };

        const modifiedDropdownValue = (name, type) => {
            const block = strategy_dom.querySelector(`field[name="${name}"]`);

            block.innerHTML = this.trade_options[type];
        };

        const dropdowns = {
            MARKET_LIST: 'market',
            TYPE_LIST  : 'contract',
        };
        const fields = ['stake', 'size', 'loss', 'profit'];

        Object.keys(dropdowns).forEach(key => modifiedDropdownValue(key, dropdowns[key]));
        fields.forEach(field => modifiedValue(field));

        workspace.clear();
        Blockly.Xml.domToWorkspace(strategy_dom, workspace);
    }

    @computed
    get tradeOptionValues() {
        return this.trade_options;
    }

    @computed
    get modalOpen() {
        return this.modal_is_open;
    }

    @action.bound
    closeModal = () => {
        this.modal_is_open = !this.modal_is_open;
    };

    @action.bound
    setTradeOption = (name, value) => {
        this.trade_options[name] = value;
    };

    @action.bound
    setShowAgain = show_again => {
        this.show_again = show_again;
        localStorage.setItem('StarterHint', this.show_again);
    }

    @action.bound
    setStrategy = strategy => {
        this.strategy = strategy;
    }

    @action.bound
    handleSubmit = e => {
        e.preventDefault();

        this.closeModal();
        this.updateStrategy();
    };
}
