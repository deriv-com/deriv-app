import { observable, action, computed } from 'mobx';
import { getIndicativePrice, isEqualObject, isMultiplierContract } from '@deriv/shared';
import { contract_stages } from 'Constants/contract-stage';
import { getContractUpdateConfig } from 'Utils/logic';

export default class SummaryCardStore {
    @observable contract_info = null;
    @observable indicative_movement = '';
    @observable profit_movement = '';

    // Multiplier contract update config
    @observable contract_update_take_profit = '';
    @observable contract_update_stop_loss = '';
    @observable has_contract_update_take_profit = false;
    @observable has_contract_update_stop_loss = false;
    contract_update_config = {};
    count = 0;

    @observable
    validation_errors = {};

    contract_id = null;
    profit = 0;
    indicative = 0;

    constructor(root_store) {
        this.root_store = root_store;
    }

    @computed
    get is_contract_completed() {
        return (
            !!this.contract_info &&
            !!this.contract_info.is_sold &&
            this.root_store.run_panel.contract_stage !== contract_stages.PURCHASE_RECEIVED
        );
    }

    @computed
    get is_contract_loading() {
        return (
            (this.root_store.run_panel.is_running && this.contract_info === null) ||
            this.root_store.run_panel.contract_stage === contract_stages.PURCHASE_SENT ||
            this.root_store.run_panel.contract_stage === contract_stages.STARTING
        );
    }

    @computed
    get is_contract_inactive() {
        return !this.contract_info && !this.is_loading;
    }

    @action.bound
    clear(should_unset_contract = true) {
        if (should_unset_contract) {
            this.contract_info = null;
        }

        this.profit = 0;
        this.profit_loss = 0;
        this.indicative = 0;
        this.indicative_movement = '';
        this.profit_movement = '';
    }

    @action.bound
    clearContractUpdateConfigValues() {
        if (this.contract_info) {
            Object.assign(this, getContractUpdateConfig(this.contract_info));
        }
    }

    @action.bound
    getLimitOrder = () => {
        const limit_order = {};

        // send positive take_profit to update or null cancel
        limit_order.take_profit = this.has_contract_update_take_profit ? +this.contract_update_take_profit : null;

        // send positive stop_loss to update or null to cancel
        limit_order.stop_loss = this.has_contract_update_stop_loss ? +this.contract_update_stop_loss : null;

        return limit_order;
    };

    @action.bound
    onBotContractEvent(contract) {
        const { profit } = contract;
        const indicative = getIndicativePrice(contract);

        if (this.contract_id !== contract.id) {
            this.clear(false);
            this.contract_id = contract.id;
            this.profit = profit;
            this.indicative = indicative;
        }

        const movements = { profit, indicative };

        Object.keys(movements).forEach(name => {
            if (movements[name] !== this[name]) {
                this[`${name}_movement`] = movements[name] > this[name] ? 'profit' : 'loss';
            } else if (this[`${name}_movement`] !== '') {
                this.indicative_movement = '';
            }

            this[name] = movements[name];
        });

        // TODO only add props that is being used
        this.contract_info = contract;
    }

    @action.bound
    onChange({ name, value }) {
        this[name] = value;
    }

    @action.bound
    populateConfig(contract_info) {
        this.contract_info = contract_info;
        const is_multiplier = isMultiplierContract(this.contract_info.contract_type);

        if (is_multiplier && contract_info.contract_id && contract_info.limit_order) {
            this.populateContractUpdateConfig(this.contract_info);
        }
    }

    @action.bound
    populateContractUpdateConfig(response) {
        const contract_update_config = getContractUpdateConfig(response);

        if (!isEqualObject(this.contract_update_config, contract_update_config)) {
            Object.assign(this, contract_update_config);
            this.contract_update_config = contract_update_config;

            const { contract_update, error } = response;
            if (contract_update && !error) {
                this.contract_info.limit_order = Object.assign(this.contract_info.limit_order || {}, contract_update);
            }
        }
    }

    @action.bound
    setContractUpdateConfig(contract_update_take_profit, contract_update_stop_loss) {
        this.has_contract_update_take_profit = !!contract_update_take_profit;
        this.has_contract_update_stop_loss = !!contract_update_stop_loss;
        this.contract_update_take_profit = this.has_contract_update_take_profit ? +contract_update_take_profit : null;
        this.contract_update_stop_loss = this.has_contract_update_stop_loss ? +contract_update_stop_loss : null;
    }

    @action.bound
    updateLimitOrder() {
        const limit_order = this.getLimitOrder();

        this.root_store.ws.contractUpdate(this.contract_info.contract_id, limit_order).then(response => {
            if (response.error) {
                this.root_store.run_panel.showContractUpdateErrorDialog(response.error.message);
                return;
            }

            // Update contract store
            this.populateContractUpdateConfig(response);
        });
    }
}
