import { action, computed, observable, makeObservable } from 'mobx';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import ServerTime from 'Utils/server-time';
import { roundOffDecimal, removeTrailingZeros } from 'Utils/format-value';
import { countDecimalPlaces } from 'Utils/string';

export default class FloatingRateStore extends BaseStore {
    fixed_rate_adverts_status;
    float_rate_adverts_status;
    float_rate_offset_limit;
    fixed_rate_adverts_end_date;
    exchange_rate;
    change_ad_alert = false;
    is_loading;
    api_error_message = '';
    is_market_rate_changed = false;
    override_exchange_rate = null;
    previous_exchange_rate = null;
    current_exchange_rate = null;
    exchange_rate_subscription = {};

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            fixed_rate_adverts_status: observable,
            float_rate_adverts_status: observable,
            float_rate_offset_limit: observable,
            fixed_rate_adverts_end_date: observable,
            exchange_rate: observable,
            change_ad_alert: observable,
            is_loading: observable,
            api_error_message: observable,
            is_market_rate_changed: observable,
            market_rate: computed,
            rate_type: computed,
            reached_target_date: computed,
            setFixedRateAdvertStatus: action.bound,
            setFloatingRateAdvertStatus: action.bound,
            setFloatRateOffsetLimit: action.bound,
            setFixedRateAdvertsEndDate: action.bound,
            setChangeAdAlert: action.bound,
            setApiErrorMessage: action.bound,
            setIsLoading: action.bound,
            setExchangeRate: action.bound,
            setIsMarketRateChanged: action.bound,
            setOverrideExchangeRate: action.bound,
            fetchExchangeRate: action.bound,
        });
    }

    get market_rate() {
        return this.exchange_rate > 0 ? this.exchange_rate : this.override_exchange_rate;
    }

    get rate_type() {
        if (this.float_rate_adverts_status === 'enabled') {
            return ad_type.FLOAT;
        }
        return ad_type.FIXED;
    }

    get reached_target_date() {
        // Ensuring the date is translated to EOD GMT without the time difference
        const current_date = new Date(ServerTime.get()) ?? new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
        const cutoff_date = new Date(new Date(this.fixed_rate_adverts_end_date).getTime()).setUTCHours(23, 59, 59, 999);
        return current_date > cutoff_date;
    }

    setFixedRateAdvertStatus(fixed_rate_advert_status) {
        this.fixed_rate_adverts_status = fixed_rate_advert_status;
    }
    setFloatingRateAdvertStatus(floating_rate_advert_status) {
        this.float_rate_adverts_status = floating_rate_advert_status;
    }
    setFloatRateOffsetLimit(offset_limit) {
        if (countDecimalPlaces(offset_limit) > 2) {
            this.float_rate_offset_limit = parseFloat(offset_limit - 0.005).toFixed(2);
        } else {
            this.float_rate_offset_limit = parseFloat(offset_limit).toFixed(2);
        }
    }
    setFixedRateAdvertsEndDate(end_date) {
        this.fixed_rate_adverts_end_date = end_date;
    }
    setChangeAdAlert(is_alert_set) {
        this.change_ad_alert = is_alert_set;
    }
    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }
    setIsLoading(state) {
        this.is_loading = state;
    }

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

    setIsMarketRateChanged(value) {
        this.is_market_rate_changed = value;
    }

    setOverrideExchangeRate(override_exchange_rate) {
        this.override_exchange_rate = removeTrailingZeros(roundOffDecimal(parseFloat(override_exchange_rate), 6));
    }

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
                const rates = response.exchange_rates?.rates;
                const rate = rates?.[client?.local_currency_config?.currency] ?? rates?.[selected_local_currency];
                this.setExchangeRate(rate);
                this.setApiErrorMessage(null);
            }
        }
    }
}
