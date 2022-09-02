import debounce from 'lodash.debounce';
import { action, computed, observable, runInAction } from 'mobx';
import { toMoment, WS } from '@deriv/shared';

import { formatStatementTransaction } from './Helpers/format-response';
import getDateBoundaries from '../Profit/Helpers/format-request';
import BaseStore from '../../base-store';

const batch_size = 100; // request response limit
const delay_on_scroll_time = 150; // fetch debounce delay on scroll

export default class StatementStore extends BaseStore {
    @observable data = [];
    @observable is_loading = false;
    @observable has_loaded_all = false;
    @observable date_from = null;
    @observable date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
    @observable error = '';
    @observable action_type = 'all';
    @observable filtered_date_range;

    // `client_loginid` is only used to detect if this is in sync with the client-store, don't rely on
    // this for calculations. Use the client.currency instead.
    @observable client_loginid = '';

    @observable account_statistics = {};

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
        this.data = [];
        this.has_loaded_all = false;
        this.is_loading = false;
    }

    @action.bound
    clearDateFilter() {
        this.date_from = null;
        this.date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        this.partial_fetch_time = 0;
    }

    shouldFetchNextBatch(should_load_partially) {
        if (!should_load_partially && (this.has_loaded_all || this.is_loading)) return false;
        const today = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        if (this.date_to < today) return !should_load_partially && this.partial_fetch_time;
        return true;
    }

    @action.bound
    async fetchNextBatch(should_load_partially = false) {
        if (!this.shouldFetchNextBatch(should_load_partially)) return;
        this.is_loading = true;

        const optional_arguments = getDateBoundaries(
            this.date_from,
            this.date_to,
            this.partial_fetch_time,
            should_load_partially
        );

        if (this.action_type !== 'all') {
            optional_arguments.action_type = this.action_type;
        }

        const response = await WS.statement(
            batch_size,
            !should_load_partially ? this.data.length : undefined,
            optional_arguments
        );
        this.statementHandler(response, should_load_partially);
    }

    @action.bound
    statementHandler(response, should_load_partially) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.statement.transactions.map(transaction =>
            formatStatementTransaction(
                transaction,
                this.root_store.client.currency,
                this.root_store.active_symbols.active_symbols
            )
        );

        if (should_load_partially) {
            this.data = [...formatted_transactions, ...this.data];
        } else {
            this.data = [...this.data, ...formatted_transactions];
        }
        this.has_loaded_all = !should_load_partially && formatted_transactions.length < batch_size;
        this.is_loading = false;
        if (formatted_transactions.length > 0) {
            this.partial_fetch_time = toMoment().unix();
        }
    }

    @action.bound
    handleDateChange(date_values, { date_range } = {}) {
        this.filtered_date_range = date_range;
        this.date_from = date_values?.from ?? (date_values.is_batch ? null : this.date_from);
        this.date_to = date_values?.to ?? this.date_to;
        this.clearTable();
        this.fetchNextBatch();
    }

    @action.bound
    handleFilterChange(filterValue = {}) {
        this.action_type = filterValue;
        this.clearTable();
        this.fetchNextBatch();
    }

    fetchOnScroll = debounce(left => {
        if (left < 1500) {
            this.fetchNextBatch();
        }
    }, delay_on_scroll_time);

    @action.bound
    handleScroll(event) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);

        this.fetchOnScroll(left_to_scroll);
    }

    @action.bound
    async loadAccountStatistics() {
        this.account_statistics = {};
        const { client } = this.root_store;
        const is_mx_mlt = client.standpoint.iom || client.standpoint.malta;
        if (is_mx_mlt) {
            const response_account_statistics = await WS.accountStatistics();
            runInAction(() => {
                if (response_account_statistics.error) {
                    this.account_statistics = {};
                    return;
                }

                this.account_statistics = response_account_statistics.account_statistics;
            });
        }
    }

    @action.bound
    accountSwitcherListener() {
        return new Promise(resolve => {
            this.clearTable();
            this.clearDateFilter();
            this.loadAccountStatistics();
            return resolve(this.fetchNextBatch());
        });
    }

    @action.bound
    networkStatusChangeListener(is_online) {
        this.is_loading = !is_online;
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
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        await WS.wait('authorize');
        this.fetchNextBatch(true);
        this.loadAccountStatistics();
    }

    /* DO NOT call clearDateFilter() upon unmounting the component, date filters should stay
    as we change tab or click on any contract for later references as discussed with UI/UX and QA */
    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        WS.forgetAll('proposal');
    }
}
