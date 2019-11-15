import debounce                          from 'lodash.debounce';
import {
    action,
    computed,
    observable,
}                                        from 'mobx';
import { WS }                            from 'Services/ws-methods';
import { toMoment }                      from 'Utils/Date';
import getDateBoundaries                 from './Helpers/format-request';
import { formatProfitTableTransactions } from './Helpers/format-response';
import BaseStore                         from '../../base-store';

const batch_size = 50;
const delay_on_scroll_time = 150;

export default class ProfitTableStore extends BaseStore {
    @observable data           = [];
    @observable date_from      =  null;
    @observable date_to        = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
    @observable error          = '';
    @observable has_loaded_all = false;
    @observable is_loading     = false;

    // `client_loginid` is only used to detect if this is in sync with the client-store, don't rely on
    // this for calculations. Use the client.currency instead.
    @observable client_loginid = '';

    @computed
    get total_profit () {
        return this.data.reduce((previous, current) => {
            const buy_price  = Number(parseFloat(current.buy_price));
            const sell_price = Number(parseFloat(current.sell_price));
            const pl         = sell_price - buy_price;
            return previous + pl;
        }, 0);
    }

    @computed
    get is_empty() {
        return !this.is_loading && this.data.length === 0;
    }

    @computed
    get has_selected_date() {
        return !!(this.date_from || this.date_to);
    }

    shouldFetchNextBatch(should_load_partially) {
        if (!should_load_partially && (this.has_loaded_all || this.is_loading)) return false;
        const today = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        if (this.date_to < today) return (!should_load_partially && this.partial_fetch_time);
        return true;
    }

    @action.bound
    async fetchNextBatch(should_load_partially = false) {
        if (!this.shouldFetchNextBatch(should_load_partially)) return;
        this.is_loading = true;

        const response = await WS.profitTable(
            batch_size,
            !should_load_partially ? this.data.length : undefined,
            getDateBoundaries(this.date_from, this.date_to, this.partial_fetch_time, should_load_partially)
        );

        this.profitTableResponseHandler(response, should_load_partially);
    }

    @action.bound
    profitTableResponseHandler(response, should_load_partially = false) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.profit_table.transactions
            .map(transaction => formatProfitTableTransactions(
                transaction,
                this.root_store.client.currency,
                this.root_store.modules.trade.active_symbols,
            ));

        if (should_load_partially) {
            this.data = [...formatted_transactions, ...this.data];
        } else {
            this.data = [...this.data, ...formatted_transactions];
        }
        this.has_loaded_all      = !should_load_partially && formatted_transactions.length < batch_size;
        this.is_loading          = false;
        if (formatted_transactions.length > 0) {
            this.partial_fetch_time = toMoment().unix();
        }
    }

    fetchOnScroll = debounce((left) => {
        if (left < 2000) {
            this.fetchNextBatch();
        }
    }, delay_on_scroll_time);

    @action.bound
    handleScroll(event) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const left_to_scroll                            = scrollHeight - (scrollTop + clientHeight);
        this.fetchOnScroll(left_to_scroll);
    }

    @action.bound
    async onMount() {
        this.assertHasValidCache(
            this.client_loginid,
            this.clearDateFilter,
            this.clearTable,
            WS.forgetAll.bind(null, 'proposal')
        );
        this.client_loginid = this.root_store.client.loginid;
        this.onSwitchAccount(this.accountSwitcherListener);
        await WS.wait('authorize');
        this.fetchNextBatch(true);
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        WS.forgetAll('proposal');
    }

    @computed
    get totals() {
        let profit_loss = 0;

        this.data.forEach((transaction) => {
            profit_loss += parseFloat(transaction.profit_loss.replace(/,/g,''));
        });
        return {
            profit_loss: profit_loss.toString(),
        };
    }

    @action.bound
    accountSwitcherListener() {
        return new Promise((resolve) => {
            this.clearTable();
            this.clearDateFilter();
            return resolve(this.fetchNextBatch());
        });
    }

    @action.bound
    clearTable() {
        this.data           = [];
        this.has_loaded_all = false;
        this.is_loading     = false;
    }

    @action.bound
    clearDateFilter() {
        this.date_from = null;
        this.date_to   = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        this.partial_fetch_time = 0;
    }

    @action.bound
    handleDateChange(date_values) {
        Object.keys(date_values).forEach(key => {
            this[`date_${key}`] = date_values[key];
        });
        this.clearTable();
        this.fetchNextBatch();
    }
}
