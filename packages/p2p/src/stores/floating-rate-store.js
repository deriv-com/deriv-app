import { action, computed, observable, makeObservable } from 'mobx';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import ServerTime from 'Utils/server-time';
import { countDecimalPlaces } from 'Utils/string';

export default class FloatingRateStore extends BaseStore {
    float_rate_adverts_status;
    float_rate_offset_limit;
    fixed_rate_adverts_end_date;
    change_ad_alert = false;
    api_error_message = '';

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            float_rate_adverts_status: observable,
            float_rate_offset_limit: observable,
            fixed_rate_adverts_end_date: observable,
            change_ad_alert: observable,
            api_error_message: observable,
            rate_type: computed,
            reached_target_date: computed,
            setFloatingRateAdvertStatus: action.bound,
            setFloatRateOffsetLimit: action.bound,
            setFixedRateAdvertsEndDate: action.bound,
            setChangeAdAlert: action.bound,
            setApiErrorMessage: action.bound,
        });
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
}
