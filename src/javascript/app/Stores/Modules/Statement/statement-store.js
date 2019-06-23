import {
    action,
    computed,
    observable,
    runInAction,
} from 'mobx';
import { WS }                         from 'Services';
import { epochToMoment }              from 'Utils/Date';
import { formatStatementTransaction } from './Helpers/format-response';
import BaseStore                      from '../../base-store';

const batch_size = 100; // request response limit

export default class StatementStore extends BaseStore {
    @observable data           = [];
    @observable is_loading     = false;
    @observable has_loaded_all = false;
    @observable date_from      = 0;
    @observable date_to        = 0;
    @observable error          = '';

    // `client_currency` is only used to detect if this is in sync with the client-store, don't rely on
    // this for calculations. Use the client.currency instead.
    @observable client_currency = '';

    @computed
    get is_empty() {
        return !this.is_loading && this.data.length === 0;
    }

    @computed
    get has_selected_date() {
        return !!(this.date_from || this.date_to);
    }

    @action.bound
    clearTable() {
        this.data           = [];
        this.has_loaded_all = false;
        this.is_loading     = false;
    }

    @action.bound
    clearDateFilter() {
        this.date_from = 0;
        this.date_to   = 0;
    }

    @action.bound
    async fetchNextBatch() {
        if (this.has_loaded_all || this.is_loading) return;

        this.is_loading = true;

        const response = await WS.statement(
            batch_size,
            this.data.length,
            {
                ...this.date_from && { date_from: this.date_from },
                ...this.date_to && { date_to: epochToMoment(this.date_to).add(1, 'd').subtract(1, 's').unix() },
            },
        );
        this.statementHandler(response);
    }

    @action.bound
    statementHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.statement.transactions
            .map(transaction => formatStatementTransaction(transaction,
                this.root_store.client.currency,
                this.root_store.modules.trade.active_symbols,
            ));

        this.data           = [...this.data, ...formatted_transactions];
        this.has_loaded_all = formatted_transactions.length < batch_size;
        this.is_loading     = false;
    }

    @action.bound
    handleDateChange(date_values) {
        Object.keys(date_values).forEach(key => {
            if (date_values[key]) {
                this[`date_${key}`] = date_values[key];
            }
        });
        this.clearTable();
        this.fetchNextBatch();
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
    accountSwitcherListener() {
        return new Promise((resolve) => {
            this.clearTable();
            this.clearDateFilter();
            return resolve(this.fetchNextBatch());
        });
    }

    @action.bound
    assertHasValidCache() {
        // account was changed when this was unmounted.
        if (this.currency !== this.client_currency) {
            WS.forgetAll('proposal');
            this.clearTable();
            this.clearDateFilter();
        }
    }

    @action.bound
    async onMount() {
        this.assertHasValidCache();
        this.onSwitchAccount(this.accountSwitcherListener);
        await this.fetchNextBatch();
        runInAction(() => {
            this.client_currency = this.root_store.client.currency;
        });
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        WS.forgetAll('proposal');
    }
}
