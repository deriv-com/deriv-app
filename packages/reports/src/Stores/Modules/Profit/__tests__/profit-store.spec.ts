import { mockStore } from '@deriv/stores';
import { configure } from 'mobx';
import ProfitTableStore from '../profit-store';
import { TCoreStores } from '@deriv/stores/types';
import { toMoment, WS } from '@deriv/shared';
import { waitFor } from '@testing-library/react';

configure({ safeDescriptors: false });

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
    let mockedProfitTableStore: ProfitTableStore;

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
        mockedProfitTableStore = new ProfitTableStore({
            root_store: mockStore({}) as TCoreStores,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('is_empty', () => {
        beforeEach(() => {
            mockedProfitTableStore.onMount();
        });
        it('should return false if is_loading={false} but data is non-empty, regardless of is_loading value', () => {
            expect(mockedProfitTableStore.data).toEqual([multiplier_contract, rise_contract]);
            expect(mockedProfitTableStore.is_loading).toEqual(false);

            expect(mockedProfitTableStore.is_empty).toBe(false);

            mockedProfitTableStore.is_loading = true;

            expect(mockedProfitTableStore.is_empty).toBe(false);
        });
        it('should return true if is_loading={false} and data is empty', () => {
            mockedProfitTableStore.is_loading = false;
            mockedProfitTableStore.data = [];

            expect(mockedProfitTableStore.is_empty).toBe(true);
        });
    });
    describe('has_selected_date', () => {
        it('should return true if date_from or date_to is truthy', () => {
            expect(mockedProfitTableStore.date_from).toBeNull();
            expect(mockedProfitTableStore.date_to).toBe(toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix());

            expect(mockedProfitTableStore.has_selected_date).toBe(true);
        });
        it('should return false if date_from and date_to are both falsy', () => {
            expect(mockedProfitTableStore.date_from).toBeNull();
            // @ts-expect-error TODO: remove the comment after profit-store is migrated to TS
            mockedProfitTableStore.date_to = null;

            expect(mockedProfitTableStore.has_selected_date).toBe(false);
        });
    });
    describe('shouldFetchNextBatch', () => {
        it('should return true if has_loaded_all={false} and is_loading={false}', () => {
            expect(mockedProfitTableStore.has_loaded_all).toBe(false);
            mockedProfitTableStore.is_loading = false;

            expect(mockedProfitTableStore.shouldFetchNextBatch()).toBe(true);
        });
        it('should return false if has_loaded_all or is_loading are true', () => {
            mockedProfitTableStore.is_loading = false;
            mockedProfitTableStore.has_loaded_all = true;

            expect(mockedProfitTableStore.shouldFetchNextBatch()).toBe(false);
        });
        it('should return true if has_loaded_all or is_loading are true but called with true is_mounting param', () => {
            mockedProfitTableStore.is_loading = false;
            mockedProfitTableStore.has_loaded_all = true;

            expect(mockedProfitTableStore.shouldFetchNextBatch(true)).toBe(true);
        });
    });
    describe('fetchNextBatch', () => {
        it('should make profitTable call and call profitTableResponseHandler if has_loaded_all={false} & is_loading={false}, or when called with truthy isMounting param', async () => {
            const spyWSProfitTable = jest.spyOn(WS, 'profitTable');
            const spyProfitTableResponseHandler = jest.spyOn(mockedProfitTableStore, 'profitTableResponseHandler');

            expect(mockedProfitTableStore.has_loaded_all).toBe(false);
            mockedProfitTableStore.is_loading = false;

            mockedProfitTableStore.fetchNextBatch();

            expect(spyWSProfitTable).toBeCalled();
            await waitFor(() => expect(spyProfitTableResponseHandler).toBeCalled());
        });
        it('should not make profitTable call or call profitTableResponseHandler if shouldFetchNextBatch() returns false', () => {
            const spyWSProfitTable = jest.spyOn(WS, 'profitTable');
            const spyProfitTableResponseHandler = jest.spyOn(mockedProfitTableStore, 'profitTableResponseHandler');

            expect(mockedProfitTableStore.is_loading).toBe(true);
            mockedProfitTableStore.fetchNextBatch();

            expect(spyWSProfitTable).not.toBeCalled();
            expect(spyProfitTableResponseHandler).not.toBeCalled();
        });
    });
    // describe('profitTableResponseHandler', () => {
    //     it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
    //         const spyDisposeSwitchAccount = jest.spyOn(mockedProfitTableStore, 'disposeSwitchAccount');
    //         const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
    //         mockedProfitTableStore.onUnmount();

    //         expect(spyDisposeSwitchAccount).toHaveBeenCalled();
    //         expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
    //     });
    // });
    // describe('fetchOnScroll', () => {
    //     it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
    //         const spyDisposeSwitchAccount = jest.spyOn(mockedProfitTableStore, 'disposeSwitchAccount');
    //         const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
    //         mockedProfitTableStore.onUnmount();

    //         expect(spyDisposeSwitchAccount).toHaveBeenCalled();
    //         expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
    //     });
    // });
    // describe('handleScroll', () => {
    //     it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
    //         const spyDisposeSwitchAccount = jest.spyOn(mockedProfitTableStore, 'disposeSwitchAccount');
    //         const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
    //         mockedProfitTableStore.onUnmount();

    //         expect(spyDisposeSwitchAccount).toHaveBeenCalled();
    //         expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
    //     });
    // });
    describe('networkStatusChangeListener', () => {
        it('should set is_loading to false if is_online param value is true while is_loading={false}', () => {
            mockedProfitTableStore.is_loading = false;

            mockedProfitTableStore.networkStatusChangeListener(true);

            expect(mockedProfitTableStore.is_loading).toBe(false);
        });
        it('should set is_loading to true if is_online param value is false while is_loading={false}', () => {
            mockedProfitTableStore.is_loading = false;

            mockedProfitTableStore.networkStatusChangeListener(false);

            expect(mockedProfitTableStore.is_loading).toBe(true);
        });
        it('should set is_loading to true if is_loading={true} regardless of the is_online param', () => {
            expect(mockedProfitTableStore.is_loading).toBe(true);

            mockedProfitTableStore.networkStatusChangeListener(false);

            expect(mockedProfitTableStore.is_loading).toBe(true);

            mockedProfitTableStore.networkStatusChangeListener(true);

            expect(mockedProfitTableStore.is_loading).toBe(true);
        });
    });
    // describe('onMount', () => {
    //     it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
    //         const spyDisposeSwitchAccount = jest.spyOn(mockedProfitTableStore, 'disposeSwitchAccount');
    //         const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
    //         mockedProfitTableStore.onUnmount();

    //         expect(spyDisposeSwitchAccount).toHaveBeenCalled();
    //         expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
    //     });
    // });
    describe('onUnmount', () => {
        it('should call disposeSwitchAccount and unsubscribe from proposal API', () => {
            const spyDisposeSwitchAccount = jest.spyOn(mockedProfitTableStore, 'disposeSwitchAccount');
            const spyWSForgetAll = jest.spyOn(WS, 'forgetAll');
            mockedProfitTableStore.onUnmount();

            expect(spyDisposeSwitchAccount).toHaveBeenCalled();
            expect(spyWSForgetAll).toHaveBeenCalledWith('proposal');
        });
    });
    describe('totals', () => {
        it('should return total profit_loss of all transactions', async () => {
            mockedProfitTableStore.onMount();

            await waitFor(() => {
                expect(mockedProfitTableStore.totals).toEqual({ profit_loss: '-2.09' });
            });
        });
    });
    describe('accountSwitcherListener', () => {
        it('should call clearTable, clearDateFilter & fetchNextBatch', () => {
            const spyClearTable = jest.spyOn(mockedProfitTableStore, 'clearTable');
            const spyClearDateFilter = jest.spyOn(mockedProfitTableStore, 'clearDateFilter');
            const spyFetchNextBatch = jest.spyOn(mockedProfitTableStore, 'fetchNextBatch');

            mockedProfitTableStore.accountSwitcherListener();

            expect(spyClearTable).toHaveBeenCalled();
            expect(spyClearDateFilter).toHaveBeenCalled();
            expect(spyFetchNextBatch).toHaveBeenCalled();
        });
    });
    describe('clearTable', () => {
        it('should clear data, has_loaded_all & is_loading', async () => {
            mockedProfitTableStore.onMount();

            await waitFor(() => {
                expect(mockedProfitTableStore.data).toEqual([multiplier_contract, rise_contract]);

                mockedProfitTableStore.clearTable();
                expect(mockedProfitTableStore.data).toEqual([]);
                expect(mockedProfitTableStore.has_loaded_all).toBe(false);
                expect(mockedProfitTableStore.is_loading).toBe(false);
            });
        });
    });
    describe('clearDateFilter', () => {
        it('should clear data_from and reset date_to to today unix timestamp', () => {
            // @ts-expect-error TODO: remove the comment after profit-store is migrated to TS
            mockedProfitTableStore.date_from = 1718236800;
            mockedProfitTableStore.date_to = 1718236800;

            mockedProfitTableStore.clearDateFilter();
            expect(mockedProfitTableStore.date_from).toBeNull();
            expect(mockedProfitTableStore.date_to).toBe(toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix());
        });
    });
    describe('handleDateChange', () => {
        it('should set filtered_date_range with date_range value, call clearTable & fetchNextBatch with shouldFilterContractTypes value', () => {
            const spyClearTable = jest.spyOn(mockedProfitTableStore, 'clearTable');
            const spyFetchNextBatch = jest.spyOn(mockedProfitTableStore, 'fetchNextBatch');
            mockedProfitTableStore.handleDateChange(
                {},
                {
                    date_range: { duration: 0, label: 'Today' },
                    shouldFilterContractTypes: true,
                }
            );

            expect(mockedProfitTableStore.filtered_date_range).toEqual({ duration: 0, label: 'Today' });
            expect(spyClearTable).toHaveBeenCalled();
            expect(spyFetchNextBatch).toBeCalledWith(true);

            mockedProfitTableStore.handleDateChange({});
            expect(mockedProfitTableStore.filtered_date_range).not.toBeDefined();
            expect(spyFetchNextBatch).toBeCalledWith(undefined);
        });
        it('should set date_from when from is present in date_values', () => {
            mockedProfitTableStore.handleDateChange({ from: '2024-06-13T00:00:00.000Z' });
            expect(mockedProfitTableStore.date_from).toBe(1718236800);
        });
        it('should set date_to when to is present in date_values', () => {
            mockedProfitTableStore.handleDateChange({ to: '2024-06-13T00:00:00.000Z' });
            expect(mockedProfitTableStore.date_to).toBe(1718236800);
        });
        it('should set date_from to null when from is missing from date_values and is_batch={true}', () => {
            mockedProfitTableStore.handleDateChange({ is_batch: true });
            expect(mockedProfitTableStore.date_from).toBeNull();
        });
    });
});
