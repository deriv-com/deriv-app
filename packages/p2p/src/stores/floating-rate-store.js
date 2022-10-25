import { action, computed, observable } from 'mobx';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import ServerTime from 'Utils/server-time';
import { roundOffDecimal, removeTrailingZeros } from 'Utils/format-value';
import { countDecimalPlaces } from 'Utils/string';

export default class FloatingRateStore extends BaseStore {
    @observable fixed_rate_adverts_status;
    @observable float_rate_adverts_status;
    @observable float_rate_offset_limit;
    @observable fixed_rate_adverts_end_date;
    @observable exchange_rate;
    @observable change_ad_alert = false;
    @observable is_loading;
    @observable api_error_message = '';
    @observable is_market_rate_changed = false;
    @observable override_exchange_rate = null;

    previous_exchange_rate = null;
    current_exchange_rate = null;

    exchange_rate_subscription = {};

    @computed
    get market_rate() {
        return this.exchange_rate > 0 ? this.exchange_rate : this.override_exchange_rate;
    }

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
        const current_date = new Date(ServerTime.get()) ?? new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
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
        if (countDecimalPlaces(offset_limit) > 2) {
            this.float_rate_offset_limit = parseFloat(offset_limit - 0.005).toFixed(2);
        } else {
            this.float_rate_offset_limit = parseFloat(offset_limit).toFixed(2);
        }
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
    setExchangeRate(rate) {
        const fetched_rate = parseFloat(rate);
        this.exchange_rate = removeTrailingZeros(roundOffDecimal(fetched_rate, 6));
        if (this.previous_exchange_rate === null) {
            this.previous_exchange_rate = this.exchange_rate;
            this.current_exchange_rate = this.exchange_rate;
        } else {
            this.previous_exchange_rate = this.current_exchange_rate;
            this.current_exchange_rate = this.exchange_rate;
            this.setIsMarketRateChanged(true);
        }
    }

    @action.bound
    setIsMarketRateChanged(value) {
        if (this.root_store.buy_sell_store.show_rate_change_popup) {
            this.is_market_rate_changed = value;
        }
    }

    @action.bound
    setOverrideExchangeRate(override_exchange_rate) {
        this.override_exchange_rate = removeTrailingZeros(roundOffDecimal(parseFloat(override_exchange_rate), 6));
    }

    @action.bound
    fetchExchangeRate(response) {
        const { buy_sell_store, general_store } = this.root_store;
        const { client, ws_subscriptions } = general_store;
        const { selected_local_currency } = buy_sell_store;

        if (response) {
            if (response.error) {
                this.setApiErrorMessage(response.error.message);
                ws_subscriptions?.exchange_rate_subscription?.unsubscribe?.();
                this.setExchangeRate(0);
            } else {
                const { rates } = response.exchange_rates;
                const rate = rates[client?.local_currency_config?.currency] ?? rates[selected_local_currency];
                this.setExchangeRate(rate);
                this.setApiErrorMessage(null);
            }
        }
    }
}
