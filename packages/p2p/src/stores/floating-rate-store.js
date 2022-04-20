import { action, computed, observable } from 'mobx';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import { ad_type } from 'Constants/floating-rate';

export default class FloatingRateStore extends BaseStore {
    @observable fixed_rate_adverts_end_date;
    @observable change_ad_alert;
    @observable is_loading;
    @observable api_error_message = '';

    @computed
    get rate_type() {
        if (this.float_rate_adverts_status === 'enabled') {
            return ad_type.FLOAT;
        }
        return ad_type.FIXED;
    }

    @computed
    get reached_target_date() {
        // Ensuring the date is translated to EOD GMT without the time difference
        const current_date = new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
        const cutoff_date = new Date(new Date(this.fixed_rate_adverts_end_date).getTime()).setUTCHours(23, 59, 59, 999);
        return current_date > cutoff_date;
    }

    @action.bound
    setFixedRateAdvertStatus(fixed_rate_advert_status) {
        this.fixed_rate_adverts_status = fixed_rate_advert_status;
    }
    @action.bound
    setFloatingRateAdvertStatus(floating_rate_advert_status) {
        this.float_rate_adverts_status = floating_rate_advert_status;
    }
    @action.bound
    setFloatRateOffsetLimit(offset_limit) {
        this.float_rate_offset_limit = parseFloat(offset_limit).toFixed(2);
    }

    @action.bound
    setFixedRateAdvertsEndDate(end_date) {
        this.fixed_rate_adverts_end_date = end_date;
    }
    @action.bound
    setChangeAdAlert(is_alert_set) {
        this.change_ad_alert = is_alert_set;
    }
    @action.bound
    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }
    @action.bound
    setIsLoading(state) {
        this.is_loading = state;
    }

    @action.bound
    setExchangeRate(fiat_currency, local_currency) {
        this.setIsLoading(true);
        const payload = {
            exchange_rates: 1,
            base_currency: fiat_currency,
            subscribe: 1,
            target_currency: local_currency,
        };
        requestWS(payload)
            .then(response => {
                if (response) {
                    if (response.error) {
                        this.setApiErrorMessage(response.error.message);
                    } else {
                        const { rates } = response.exchange_rates;
                        this.exchange_rate = parseFloat(rates[local_currency]);
                        this.setApiErrorMessage(null);
                    }
                }
            })
            .finally(() => this.setIsLoading(false));
    }
}
