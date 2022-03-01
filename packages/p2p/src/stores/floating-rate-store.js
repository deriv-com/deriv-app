import { action, computed, observable } from 'mobx';

export default class FloatingRateStore extends BaseStore {
    constructor(general_store) {
        this.general_store = general_store;
    }

    @observable fixed_rate_adverts_status = 'enabled';
    @observable float_rate_adverts_status = 'disabled';
    @observable float_rate_offset_limit = null;
    @observable fixed_rate_adverts_end_date = null;
    @observable exchange_rate = null;

    @computed
    get rate_type() {
        if (this.fixed_rate_adverts_status === 'enabled') {
            return 'fixed';
        } else {
            return 'float';
        }
    }

    @action.bound
    setP2PConfig() {
        requestWS({ website_status: 1 }).then(response => {
            if (!!response && response.error) {
                this.general_store.setApiErrorMessage(response.error.message);
            } else {
                const { p2p_config } = response.website_status;
                this.fixed_rate_adverts_status = p2p_config.fixed_rate_adverts;
                this.float_rate_adverts_status = p2p_config.float_rate_adverts;
                this.float_rate_offset_limit = p2p_config.float_rate_offset_limit;
                this.fixed_rate_adverts_end_date = p2p_config.fixed_rate_adverts_end_date;
                this.general_store.setApiErrorMessage(null);
            }
        });
    }

    @action.bound
    setExchangeRate(fiat_currency, local_currency) {
        const pay_load = {
            exchange_rates: 1,
            base_currency: fiat_currency,
            local_currency,
        };
        requestWS(pay_load).then(response => {
            if (!!response && response.error) {
                this.general_store.setApiErrorMessage(response.error.message);
            } else {
                const { rates } = response.exchange_rates;
                this.exchange_rate = rates[local_currency];
            }
        });
    }
}
