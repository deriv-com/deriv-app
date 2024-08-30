import { mockStore } from '@deriv/stores';
import { configure } from 'mobx';
import ProfitTableStore from '../profit-store';
import { TCoreStores } from '@deriv/stores/types';
import { toMoment, WS } from '@deriv/shared';
import { waitFor } from '@testing-library/react';

configure({ safeDescriptors: false });

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

jest.mock('@deriv/shared', () => {
    return {
        ...jest.requireActual('@deriv/shared'),
        WS: {
            forgetAll: jest.fn(),
            profitTable: jest.fn().mockReturnValue({
                profit_table: {
                    transactions: [
                        {
                            app_id: 16929,
                            buy_price: 11.29,
                            contract_id: 246293653348,
                            contract_type: 'MULTUP',
                            deal_cancellation_duration: '60m',
                            duration_type: 'days',
                            longcode:
                                "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
                            multiplier: '30',
                            payout: 0,
                            purchase_time: 1718717545,
                            sell_price: 8.21,
                            sell_time: 1718722095,
                            shortcode: 'MULTUP_R_100_10.00_30_1718717545_4872355199_60m_0.00_N1',
                            transaction_id: 490981792908,
                            underlying_symbol: 'R_100',
                        },
                        {
                            app_id: 16929,
                            buy_price: 10,
                            contract_id: 245824534328,
                            contract_type: 'CALL',
                            duration_type: 'hours',
                            longcode:
                                'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
                            payout: 19.73,
                            purchase_time: 1718367170,
                            sell_price: 10.99,
                            sell_time: 1718370182,
                            shortcode: 'CALL_R_100_19.73_1718367170_1718388770_S0P_0',
                            transaction_id: 490044918128,
                            underlying_symbol: 'R_100',
                        },
                    ],
                },
            }),
            wait: jest.fn(),
        },
    };
});

describe('ProfitTableStore', () => {
    let mocked_profit_table_store: ProfitTableStore;

    const custom_date_time_string = '2024-06-13T00:00:00.000Z';
    const custom_timestamp = 1718236800;
    const default_date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
    const filtered_contract_types = ['MULTUP', 'MULTDOWN'];
    const mocked_error = 'Test error';
    const mocked_loginid = 'test_loginid';
    const multiplier_contract = {
        app_id: 16929,
        buy_price: 11.29,
        contract_id: 246293653348,
        contract_type: 'MULTUP',
        deal_cancellation_duration: '60m',
        display_name: '',
        duration_type: 'days',
        longcode:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
        multiplier: '30',
        payout: 0,
        profit_loss: '-3.08',
        purchase_time: '18 Jun 2024 13:32:25',
        purchase_time_unix: 1718717545,
        sell_price: 8.21,
        sell_time: '18 Jun 2024 14:48:15',
        shortcode: 'MULTUP_R_100_10.00_30_1718717545_4872355199_60m_0.00_N1',
        transaction_id: 490981792908,
        underlying_symbol: 'R_100',
    };
    const rise_contract = {
        app_id: 16929,
        buy_price: 10,
        contract_id: 245824534328,
        contract_type: 'CALL',
        display_name: '',
        duration_type: 'hours',
        longcode:
            'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
        payout: 19.73,
        profit_loss: '0.99',
        purchase_time: '14 Jun 2024 12:12:50',
        purchase_time_unix: 1718367170,
        sell_price: 10.99,
        sell_time: '14 Jun 2024 13:03:02',
        shortcode: 'CALL_R_100_19.73_1718367170_1718388770_S0P_0',
        transaction_id: 490044918128,
        underlying_symbol: 'R_100',
    };

    beforeEach(() => {
        mocked_profit_table_store = new ProfitTableStore({
            root_store: mockStore({
                client: {
                    loginid: mocked_loginid,
                },
                modules: {
                    positions: {
                        filteredContractTypes: filtered_contract_types,
                        setDateFrom: jest.fn(),
                        setDateTo: jest.fn(),
                    },
                },
            }) as TCoreStores,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('is_empty', () => {
        beforeEach(() => {
            mocked_profit_table_store.onMount();
        });
        it('should return false if is_loading={false} but data is non-empty regardless of is_loading value', () => {
            expect(mocked_profit_table_store.data).toEqual([multiplier_contract, rise_contract]);
            expect(mocked_profit_table_store.is_loading).toEqual(false);

            expect(mocked_profit_table_store.is_empty).toBe(false);

            mocked_profit_table_store.is_loading = true;

            expect(mocked_profit_table_store.is_empty).toBe(false);
        });
        it('should return true if is_loading={false} and data is empty', () => {
            mocked_profit_table_store.is_loading = false;
            mocked_profit_table_store.data = [];

            expect(mocked_profit_table_store.is_empty).toBe(true);
        });
    });
    describe('has_selected_date', () => {
        it('should return true if date_from or date_to is truthy', () => {
            expect(mocked_profit_table_store.date_from).toBeNull();
            expect(mocked_profit_table_store.date_to).toBe(default_date_to);

            expect(mocked_profit_table_store.has_selected_date).toBe(true);
        });
        it('should return false if date_from and date_to are both falsy', () => {
            expect(mocked_profit_table_store.date_from).toBeNull();
            // @ts-expect-error TODO: remove the comment after profit-store is migrated to TS
            mocked_profit_table_store.date_to = null;

            expect(mocked_profit_table_store.has_selected_date).toBe(false);
        });
    });
    describe('shouldFetchNextBatch', () => {
        it('should return true if has_loaded_all={false} and is_loading={false}', () => {
            expect(mocked_profit_table_store.has_loaded_all).toBe(false);
            mocked_profit_table_store.is_loading = false;

            expect(mocked_profit_table_store.shouldFetchNextBatch()).toBe(true);
        });
        it('should return false if has_loaded_all or is_loading are true', () => {
            mocked_profit_table_store.is_loading = false;
            mocked_profit_table_store.has_loaded_all = true;

            expect(mocked_profit_table_store.shouldFetchNextBatch()).toBe(false);
        });
        it('should return true if has_loaded_all or is_loading are true but called with true is_mounting param', () => {
            mocked_profit_table_store.is_loading = false;
            mocked_profit_table_store.has_loaded_all = true;

            expect(mocked_profit_table_store.shouldFetchNextBatch(true)).toBe(true);
        });
    });
    describe('fetchNextBatch', () => {
        const spyWSProfitTable = jest.spyOn(WS, 'profitTable');

        it('should make profitTable call and call profitTableResponseHandler if has_loaded_all={false} & is_loading={false}, or when called with truthy isMounting param', async () => {
            const spyProfitTableResponseHandler = jest.spyOn(mocked_profit_table_store, 'profitTableResponseHandler');

            mocked_profit_table_store.fetchNextBatch(false, true);

            expect(spyWSProfitTable).toBeCalled();
            await waitFor(() => expect(spyProfitTableResponseHandler).toBeCalled());
        });
        it('should not make profitTable call or call profitTableResponseHandler if has_loaded_all or is_loading is true and not called with truthy isMounting param', () => {
            const spyProfitTableResponseHandler = jest.spyOn(mocked_profit_table_store, 'profitTableResponseHandler');

            expect(mocked_profit_table_store.is_loading).toBe(true);
            mocked_profit_table_store.fetchNextBatch();

            expect(spyWSProfitTable).not.toBeCalled();
            expect(spyProfitTableResponseHandler).not.toBeCalled();
        });
        it('should make profitTable call with contract_type param if called with truthy shouldFilterContractTypes param', () => {
            mocked_profit_table_store.is_loading = false;
            mocked_profit_table_store.fetchNextBatch(true);

            expect(spyWSProfitTable).toBeCalledWith(50, 0, {
                contract_type: filtered_contract_types,
            });
        });
    });
    describe('profitTableResponseHandler', () => {
        it('should set error if called with response containing error.message and should not set data', () => {
            mocked_profit_table_store.profitTableResponseHandler({ error: { message: mocked_error } });

            expect(mocked_profit_table_store.error).toBe(mocked_error);
            expect(mocked_profit_table_store.data).toHaveLength(0);
        });
        it('should set data if called with response containing profit_table.transactions and should not set error', () => {
            mocked_profit_table_store.profitTableResponseHandler({ profit_table: { transactions: [{}, {}] } });

            expect(mocked_profit_table_store.data).toHaveLength(2);
            expect(mocked_profit_table_store.error).toBe('');
        });
    });
    describe('fetchOnScroll', () => {
        it('should call fetchNextBatch if called with left param value that is < 1500', () => {
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');

            mocked_profit_table_store.fetchOnScroll(1100);

            expect(spyFetchNextBatch).toBeCalled();
        });
        it('should call fetchNextBatch with true for shouldFilterContractTypes value when called with true as a second param', () => {
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');

            mocked_profit_table_store.fetchOnScroll(1100, true);

            expect(spyFetchNextBatch).toBeCalledWith(true);
        });
        it('should not call fetchNextBatch if called with left param value that is > 1500', () => {
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');

            mocked_profit_table_store.fetchOnScroll(1600);

            expect(spyFetchNextBatch).not.toBeCalled();
        });
    });
    describe('handleScroll', () => {
        const scroll_values = { scrollTop: 416, scrollHeight: 2061, clientHeight: 588 };
        const left_to_scroll = scroll_values.scrollHeight - (scroll_values.scrollTop + scroll_values.clientHeight);

        it('should call fetchOnScroll with left_to_scroll value calculated from event.target scroll values', () => {
            const spyFetchOnScroll = jest.spyOn(mocked_profit_table_store, 'fetchOnScroll');
            mocked_profit_table_store.handleScroll({ target: scroll_values });

            expect(spyFetchOnScroll).toBeCalledWith(left_to_scroll, undefined);
        });
        it('should call fetchOnScroll with true for shouldFilterContractTypes value when called with true', () => {
            const spyFetchOnScroll = jest.spyOn(mocked_profit_table_store, 'fetchOnScroll');
            mocked_profit_table_store.handleScroll({ target: scroll_values }, true);

            expect(spyFetchOnScroll).toBeCalledWith(left_to_scroll, true);
        });
    });
    describe('networkStatusChangeListener', () => {
        it('should set is_loading to false if is_online param value is true while is_loading={false}', () => {
            mocked_profit_table_store.is_loading = false;

            mocked_profit_table_store.networkStatusChangeListener(true);

            expect(mocked_profit_table_store.is_loading).toBe(false);
        });
        it('should set is_loading to true if is_online param value is false while is_loading={false}', () => {
            mocked_profit_table_store.is_loading = false;

            mocked_profit_table_store.networkStatusChangeListener(false);

            expect(mocked_profit_table_store.is_loading).toBe(true);
        });
        it('should set is_loading to true if is_loading={true} regardless of the is_online param', () => {
            expect(mocked_profit_table_store.is_loading).toBe(true);

            mocked_profit_table_store.networkStatusChangeListener(false);

            expect(mocked_profit_table_store.is_loading).toBe(true);

            mocked_profit_table_store.networkStatusChangeListener(true);

            expect(mocked_profit_table_store.is_loading).toBe(true);
        });
    });
    describe('onMount', () => {
        const spyWSWait = jest.spyOn(WS, 'wait');

        it('should set client_loginid from client-store loginid, wait for authorize API and call fetchNextBatch', async () => {
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');
            mocked_profit_table_store.onMount();

            expect(mocked_profit_table_store.client_loginid).toBe(mocked_loginid);
            expect(spyWSWait).toBeCalledWith('authorize');
            await waitFor(() => expect(spyFetchNextBatch).toBeCalledWith(undefined, true));
        });
        it('should call fetchNextBatch with true for shouldFilterContractTypes value when called with true', async () => {
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');
            mocked_profit_table_store.onMount(true);

            await waitFor(() => expect(spyFetchNextBatch).toBeCalledWith(true, true));
        });
    });
    describe('onUnmount', () => {
        it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
            const spyDisposeSwitchAccount = jest.spyOn(mocked_profit_table_store, 'disposeSwitchAccount');
            const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
            mocked_profit_table_store.onUnmount();

            expect(spyDisposeSwitchAccount).toHaveBeenCalled();
            expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
        });
    });
    describe('totals', () => {
        it('should return total profit_loss of all transactions', async () => {
            mocked_profit_table_store.onMount();

            await waitFor(() => {
                expect(mocked_profit_table_store.totals).toEqual({ profit_loss: '-2.09' });
            });
        });
    });
    describe('accountSwitcherListener', () => {
        it('should call clearTable, clearDateFilter & fetchNextBatch', () => {
            const spyClearTable = jest.spyOn(mocked_profit_table_store, 'clearTable');
            const spyClearDateFilter = jest.spyOn(mocked_profit_table_store, 'clearDateFilter');
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');

            mocked_profit_table_store.accountSwitcherListener();

            expect(spyClearTable).toHaveBeenCalled();
            expect(spyClearDateFilter).toHaveBeenCalled();
            expect(spyFetchNextBatch).toHaveBeenCalled();
        });
    });
    describe('clearTable', () => {
        it('should clear data, has_loaded_all & is_loading', async () => {
            mocked_profit_table_store.onMount();

            await waitFor(() => {
                expect(mocked_profit_table_store.data).toEqual([multiplier_contract, rise_contract]);

                mocked_profit_table_store.clearTable();
                expect(mocked_profit_table_store.data).toEqual([]);
                expect(mocked_profit_table_store.has_loaded_all).toBe(false);
                expect(mocked_profit_table_store.is_loading).toBe(false);
            });
        });
    });
    describe('clearDateFilter', () => {
        it('should clear data_from and reset date_to to today unix timestamp', () => {
            // @ts-expect-error TODO: remove the comment after profit-store is migrated to TS
            mocked_profit_table_store.date_from = custom_timestamp;
            mocked_profit_table_store.date_to = custom_timestamp;

            mocked_profit_table_store.clearDateFilter();
            expect(mocked_profit_table_store.date_from).toBeNull();
            expect(mocked_profit_table_store.date_to).toBe(default_date_to);
        });
    });
    describe('handleDateChange', () => {
        it('should set filtered_date_range with date_range value, call clearTable & fetchNextBatch with shouldFilterContractTypes value', () => {
            const spyClearTable = jest.spyOn(mocked_profit_table_store, 'clearTable');
            const spyFetchNextBatch = jest.spyOn(mocked_profit_table_store, 'fetchNextBatch');
            mocked_profit_table_store.handleDateChange(
                {},
                {
                    date_range: { duration: 0, label: 'Today' },
                    shouldFilterContractTypes: true,
                }
            );

            expect(mocked_profit_table_store.filtered_date_range).toEqual({ duration: 0, label: 'Today' });
            expect(spyClearTable).toHaveBeenCalled();
            expect(spyFetchNextBatch).toBeCalledWith(true);

            mocked_profit_table_store.handleDateChange({});
            expect(mocked_profit_table_store.filtered_date_range).not.toBeDefined();
            expect(spyFetchNextBatch).toBeCalledWith(undefined);
        });
        it('should set date_from when from is present in date_values', () => {
            mocked_profit_table_store.handleDateChange({ from: custom_date_time_string });
            expect(mocked_profit_table_store.date_from).toBe(custom_timestamp);
        });
        it('should set date_to when to is present in date_values', () => {
            mocked_profit_table_store.handleDateChange({ to: custom_date_time_string });
            expect(mocked_profit_table_store.date_to).toBe(custom_timestamp);
        });
        it('should set date_from to null when from is missing from date_values and is_batch={true}', () => {
            mocked_profit_table_store.handleDateChange({ is_batch: true });
            expect(mocked_profit_table_store.date_from).toBeNull();
        });
    });
});
