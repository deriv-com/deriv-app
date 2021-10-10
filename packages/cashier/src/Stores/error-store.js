import { observable } from 'mobx';

export default class ErrorStore {
    @observable message = '';
    @observable code = '';
    @observable fields = '';
    @observable is_show_full_page = false;
    @observable onClickButton = null;
    @observable is_ask_uk_funds_protection = false;
    @observable is_self_exclusion_max_turnover_set = false;
    @observable is_ask_authentication = false;
    @observable is_ask_financial_risk_approval = false;
}
