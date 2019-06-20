import {
    action,
    computed,
    observable,
}                                        from 'mobx';
import moment                            from 'moment';
import { WS }                            from 'Services';
import { formatProfitTableTransactions } from './Helpers/format-response';
import BaseStore                         from '../../base-store';

const batch_size = 50;

export default class ProfitTableStore extends BaseStore {
    @observable data           = [];
    @observable date_from      = '';
    @observable date_to        = '';
    @observable error          = '';
    @observable has_loaded_all = false;
    @observable is_loading     = false;

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

    @action.bound
    async fetchNextBatch() {
        if (this.has_loaded_all || this.is_loading) return;

        this.is_loading = true;

        const response = await WS.profitTable({
            offset: this.data.length,
            ...this.date_from && { date_from: moment(this.date_from).unix() },
            ...this.date_to && { date_to: moment(this.date_to).add(1, 'd').subtract(1, 's').unix() },
        });
        this.profitTableResponseHandler(response);
    }

    @action.bound
    profitTableResponseHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.profit_table.transactions
            .map(transaction => formatProfitTableTransactions(
                transaction,
                this.root_store.client.currency,
            ));

        this.data           = [...this.data, ...formatted_transactions];
        this.has_loaded_all = formatted_transactions.length < batch_size;
        this.is_loading     = false;
    }

    @action.bound
    handleScroll(event) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const left_to_scroll                            = scrollHeight - (scrollTop + clientHeight);
        if (left_to_scroll < 2000) {
            this.fetchNextBatch();
        }
    }

    @action.bound
    async onMount() {
        this.onSwitchAccount(this.accountSwitcherListener);
        await this.waitFor('authorize');
        await this.fetchNextBatch();
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        this.clearTable();
        this.clearDateFilter();
        WS.forgetAll('proposal');
    }

    @computed
    get totals() {
        let profit_loss = 0;

        this.data.forEach((transaction) => {
            if (transaction.profit_loss.indexOf('-') !== -1) {
                profit_loss -= parseFloat(transaction.profit_loss.split('-')[1]);
            } else {
                profit_loss += parseFloat(transaction.profit_loss);
            }
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
        this.date_from = '';
        this.date_to   = '';
    }
}
