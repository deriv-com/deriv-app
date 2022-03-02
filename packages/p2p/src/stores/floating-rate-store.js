import { action, computed, observable } from 'mobx';
import BaseStore from 'Stores/base_store';
import { requestWS } from 'Utils/websocket';

export default class FloatingRateStore extends BaseStore {
    @observable fixed_rate_adverts_status;
    @observable float_rate_adverts_status;
    @observable float_rate_offset_limit;
    @observable fixed_rate_adverts_end_date;
    @observable exchange_rate = '100'; // TODO: Remove hardcoded value

    @action.bound
    setFixedRateAdvertStatus(fixed_rate_advert_status) {
        this.fixed_rate_adverts_status = fixed_rate_advert_status;
    }

    @action.bound
    setFloatingRateAdvertStatus(floating_rate_advert_status) {
        this.floating_rate_advert_status = floating_rate_advert_status;
    }

    @action.bound
    setFoatRateOffsetLimit(offset_limit) {
        this.float_rate_offset_limit = offset_limit;
    }

    @action.bound
    setFixedRateAdvertsEndDate(end_date) {
        this.fixed_rate_adverts_end_date = end_date;
    }

    @action.bound
    setP2PConfig() {
        requestWS({ website_status: 1 }).then(response => {
            if (!!response && response.error) {
                this.root_store.general_store.setApiErrorMessage(response.error.message);
            } else {
                const { p2p_config } = response.website_status;
                this.setFixedRateAdvertStatus(p2p_config.fixed_rate_adverts || 'disabled');
                this.setFloatingRateAdvertStatus(p2p_config.float_rate_adverts || 'enabled');
                this.setFoatRateOffsetLimit(p2p_config.float_rate_offset_limit || 3); // TODO: Remove hardcoded fallback condition
                this.setFixedRateAdvertsEndDate(p2p_config.fixed_rate_adverts_end_date || null);
                this.root_store.general_store.setApiErrorMessage(null);
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
                this.root_storegeneral_store.setApiErrorMessage(response.error.message);
            } else {
                const { rates } = response.exchange_rates;
                this.exchange_rate = rates[local_currency] || '100';
                this.root_store.general_store.setApiErrorMessage(null);
            }
        });
    }

    @computed
    get rate_type() {
        if (this.fixed_rate_adverts_status === 'enabled') {
            return 'fixed';
        }
        return 'float';
    }
}
