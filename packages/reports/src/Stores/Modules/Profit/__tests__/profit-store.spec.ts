import { mockStore } from '@deriv/stores';
import { configure } from 'mobx';
import moment from 'moment';
import ProfitTableStore from '../profit-store';
import { TCoreStores } from '@deriv/stores/types';

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
            root_store: mockStore({
                common: {
                    server_time: moment('2024-02-26T11:59:59.488Z'),
                },
            }) as TCoreStores,
        });
        mockedProfitTableStore.onMount();
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
        it('should clear data, has_loaded_all & is_loading', () => {
            expect(mockedProfitTableStore.data).toEqual([multiplier_contract, rise_contract]);

            mockedProfitTableStore.clearTable();
            expect(mockedProfitTableStore.data).toEqual([]);
            expect(mockedProfitTableStore.has_loaded_all).toBe(false);
            expect(mockedProfitTableStore.is_loading).toBe(false);
        });
    });
});
