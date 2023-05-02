import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { getIndicativePrice, isEqualObject, isMultiplierContract } from '@deriv/shared';
import { contract_stages } from 'Constants/contract-stage';
import { getValidationRules } from 'Constants/contract';
import { getContractUpdateConfig } from 'Utils/multiplier';
import Validator from 'Utils/validator';

export default class SummaryCardStore {
    contract_info = null;
    indicative_movement = '';
    profit_movement = '';

    validation_errors = {};
    validation_rules = getValidationRules();

    // Multiplier contract update config
    contract_update_take_profit = '';
    contract_update_stop_loss = '';
    has_contract_update_take_profit = false;
    has_contract_update_stop_loss = false;
    contract_update_config = {};

    contract_id = null;
    profit = 0;
    indicative = 0;

    constructor(root_store, core) {
        makeObservable(this, {
            contract_info: observable,
            indicative_movement: observable,
            profit_movement: observable,
            validation_errors: observable,
            validation_rules: observable,
            contract_update_take_profit: observable,
            contract_update_stop_loss: observable,
            has_contract_update_take_profit: observable,
            has_contract_update_stop_loss: observable,
            contract_update_config: observable,
            contract_id: observable,
            profit: observable,
            indicative: observable,
            is_contract_completed: computed,
            is_contract_loading: computed,
            is_contract_inactive: computed,
            is_multiplier: computed,
            clear: action.bound,
            clearContractUpdateConfigValues: action.bound,
            getLimitOrder: action.bound,
            onBotContractEvent: action.bound,
            onChange: action.bound,
            populateContractUpdateConfig: action.bound,
            setContractUpdateConfig: action.bound,
            updateLimitOrder: action.bound,
            setValidationErrorMessages: action,
            validateProperty: action,
            registerReactions: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
        this.disposeReactionsFn = this.registerReactions();
    }

    get is_contract_completed() {
        return (
            !!this.contract_info?.is_sold &&
            this.root_store.run_panel.contract_stage !== contract_stages.PURCHASE_RECEIVED
        );
    }

    get is_contract_loading() {
        return (
            (this.root_store.run_panel.is_running && this.contract_info === null) ||
            this.root_store.run_panel.contract_stage === contract_stages.PURCHASE_SENT ||
            this.root_store.run_panel.contract_stage === contract_stages.STARTING
        );
    }

    get is_contract_inactive() {
        return !this.contract_info && !this.is_loading;
    }

    get is_multiplier() {
        return isMultiplierContract(this.contract_info?.contract_type);
    }

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

    clearContractUpdateConfigValues() {
        if (this.contract_info) {
            Object.assign(this, getContractUpdateConfig(this.contract_info));
        }
    }

    getLimitOrder() {
        const limit_order = {};

        // send positive take_profit to update or null to cancel
        limit_order.take_profit = this.has_contract_update_take_profit ? +this.contract_update_take_profit : null;

        // send positive stop_loss to update or null to cancel
        limit_order.stop_loss = this.has_contract_update_stop_loss ? +this.contract_update_stop_loss : null;

        return limit_order;
    }

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

    onChange({ name, value }) {
        this[name] = value;
        this.validateProperty(name, this[name]);
    }

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

    setContractUpdateConfig(contract_update_take_profit, contract_update_stop_loss) {
        this.has_contract_update_take_profit = !!contract_update_take_profit;
        this.has_contract_update_stop_loss = !!contract_update_stop_loss;
        this.contract_update_take_profit = this.has_contract_update_take_profit ? +contract_update_take_profit : null;
        this.contract_update_stop_loss = this.has_contract_update_stop_loss ? +contract_update_stop_loss : null;
    }

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

    /**
     * Sets validation error messages for an observable property of the store
     *
     * @param {String} propertyName - The observable property's name
     * @param [{String}] messages - An array of strings that contains validation error messages for the particular property.
     *
     */
    setValidationErrorMessages(propertyName, messages) {
        const is_different = () =>
            !!this.validation_errors[propertyName]
                .filter(x => !messages.includes(x))
                .concat(messages.filter(x => !this.validation_errors[propertyName].includes(x))).length;
        if (!this.validation_errors[propertyName] || is_different()) {
            this.validation_errors[propertyName] = messages;
        }
    }

    /**
     * Validates a particular property of the store
     *
     * @param {String} property - The name of the property in the store
     * @param {object} value    - The value of the property, it can be undefined.
     *
     */
    validateProperty(property, value) {
        const trigger = this.validation_rules[property].trigger;
        const inputs = { [property]: value !== undefined ? value : this[property] };
        const validation_rules = { [property]: this.validation_rules[property].rules || [] };

        if (!!trigger && Object.hasOwnProperty.call(this, trigger)) {
            inputs[trigger] = this[trigger];
            validation_rules[trigger] = this.validation_rules[trigger].rules || [];
        }

        const validator = new Validator(inputs, validation_rules, this);

        validator.isPassed();

        Object.keys(inputs).forEach(key => {
            this.setValidationErrorMessages(key, validator.errors.get(key));
        });
    }

    registerReactions() {
        const { client } = this.core;
        this.disposeSwitchAcountListener = reaction(
            () => client.loginid,
            () => this.clear()
        );

        return () => {
            if (typeof this.disposeSwitchAcountListener === 'function') {
                this.disposeSwitchAcountListener();
            }
        };
    }
}
