import { action, computed, observable } from 'mobx';
import BaseStore from 'Stores/base_store';
import { ad_type } from 'Constants/floating-rate';

export default class FloatingRateStore extends BaseStore {
    @observable fixed_rate_adverts_end_date;
    @observable change_ad_alert;

    @computed
    get rate_type() {
        if (this.float_rate_adverts_status === 'enabled') {
            return ad_type.FLOAT;
        }
        return ad_type.FIXED;
    }

    @action.bound
    setFixedRateAdvertsEndDate(end_date) {
        this.fixed_rate_adverts_end_date = end_date;
    }
    @action.bound
    setChangeAdAlert(is_alert_set) {
        this.change_ad_alert = is_alert_set;
    }
}
