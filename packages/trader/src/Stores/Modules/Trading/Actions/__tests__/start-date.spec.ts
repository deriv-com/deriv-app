import { mockStore } from '@deriv/stores';
import { ContractType } from '../../Helpers/contract-type';
import { TRADE_TYPES } from '@deriv/shared';
import { onChangeExpiry, onChangeStartDate } from '../start-date';

jest.mock('@deriv/shared', () => {
    const barrier_intraday = '+0.000';
    const barrier_choices_intraday = ['-1.230', '-0.650', barrier_intraday, '+0.650', '+1.230'];
    const barrier_daily = '1790.00';
    const barrier_choices_daily = [
        '1680.00',
        '1700.00',
        '1720.00',
        '1740.00',
        '1760.00',
        barrier_daily,
        '1810.00',
        '1830.00',
        '1850.00',
        '1870.00',
        '1910.00',
    ];
    const vanilla_contracts_for_data = {
        barrier_category: 'euro_non_atm',
        barriers: 1,
        contract_category: 'vanilla',
        contract_category_display: 'Vanilla Options',
        exchange_name: 'RANDOM',
        market: 'synthetic_index',
        start_type: 'spot',
        submarket: 'random_index',
        underlying_symbol: 'R_10',
    };

    return {
        ...jest.requireActual('@deriv/shared'),
        WS: {
            contractsFor: jest.fn(() =>
                Promise.resolve({
                    contracts_for: {
                        available: [
                            {
                                ...vanilla_contracts_for_data,
                                barrier: barrier_daily,
                                barrier_choices: barrier_choices_daily,
                                contract_display: 'Vanilla Long Call',
                                contract_type: 'VANILLALONGCALL',
                                expiry_type: 'daily',
                                max_contract_duration: '365d',
                                min_contract_duration: '1d',
                                sentiment: 'up',
                            },
                            {
                                ...vanilla_contracts_for_data,
                                barrier: barrier_daily,
                                barrier_choices: barrier_choices_daily,
                                contract_display: 'Vanilla Long Put',
                                contract_type: 'VANILLALONGPUT',
                                expiry_type: 'daily',
                                max_contract_duration: '365d',
                                min_contract_duration: '1d',
                                sentiment: 'down',
                            },
                            {
                                ...vanilla_contracts_for_data,
                                barrier: barrier_intraday,
                                barrier_choices: barrier_choices_intraday,
                                contract_display: 'Vanilla Long Call',
                                contract_type: 'VANILLALONGCALL',
                                expiry_type: 'intraday',
                                max_contract_duration: '1d',
                                min_contract_duration: '1m',
                                sentiment: 'up',
                            },
                            {
                                ...vanilla_contracts_for_data,
                                barrier: barrier_intraday,
                                barrier_choices: barrier_choices_intraday,
                                contract_display: 'Vanilla Long Put',
                                contract_type: 'VANILLALONGPUT',
                                expiry_type: 'intraday',
                                max_contract_duration: '1d',
                                min_contract_duration: '1m',
                                sentiment: 'down',
                            },
                        ],
                        close: 1703203199,
                        feed_license: 'realtime',
                        hit_count: 47,
                        non_available: [],
                        open: 1703116800,
                        spot: 6945.975,
                    },
                })
            ),
            tradingTimes: jest.fn(() =>
                Promise.resolve({
                    trading_times: {
                        markets: [
                            {
                                name: 'Derived',
                                submarkets: [
                                    {
                                        name: 'Continuous Indices',
                                        symbols: [
                                            {
                                                events: [
                                                    {
                                                        dates: 'Fridays',
                                                        descrip: 'Closes early (at 20:55)',
                                                    },
                                                    {
                                                        dates: '2023-12-25',
                                                        descrip: 'Christmas Day',
                                                    },
                                                    {
                                                        dates: '2024-01-01',
                                                        descrip: "New Year's Day",
                                                    },
                                                ],
                                                name: 'AUD/JPY',
                                                symbol: 'frxAUDJPY',
                                                times: {
                                                    close: ['23:59:59'],
                                                    open: ['00:00:00'],
                                                    settlement: '23:59:59',
                                                },
                                                trading_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                                            },
                                            {
                                                events: [],
                                                name: 'Volatility 10 Index',
                                                symbol: 'R_10',
                                                times: {
                                                    close: ['23:59:59'],
                                                    open: ['00:00:00'],
                                                    settlement: '23:59:59',
                                                },
                                                trading_days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    echo_req: {
                        trading_times: '2023-12-25',
                    },
                })
            ),
        },
    };
});

jest.mock('_common/base/server_time', () => ({
    get: jest.fn(() => ({
        isBefore: jest.fn(() => true),
        clone: jest.fn(() => ({ add: jest.fn(() => ({ format: jest.fn(() => '22:05') })) })),
        get: jest.fn(),
    })),
}));

const underlying = 'R_10';
const duration_units_list = [
    { text: 'Minutes', value: 'm' },
    { text: 'Hours', value: 'h' },
    { text: 'Days', value: 'd' },
];
const trade_store = {
    ...mockStore({}).modules.trade,
    contract_type: TRADE_TYPES.VANILLA.CALL,
    contract_expiry_type: 'intraday',
    duration_unit: 'h',
    duration_units_list,
    expiry_date: 1701428800,
    expiry_type: 'duration',
    start_date: 0,
    symbol: underlying,
};

describe('onChangeStartDate', () => {
    beforeAll(() => {
        ContractType.buildContractTypesConfig(underlying);
    });
    it('should return an object with start_time equal to null when start_date is 0', async () => {
        const result = {
            contract_start_type: 'spot',
            duration_units_list,
            duration_min_max: {
                daily: { min: 86400, max: 31536000 },
                intraday: { min: 60, max: 86400 },
            },
            duration_unit: 'h',
            start_time: null,
            expiry_date: null,
            expiry_type: 'duration',
        };
        expect(
            await onChangeStartDate({
                ...trade_store,
            })
        ).toEqual(result);
        expect(
            await onChangeStartDate({
                ...trade_store,
                start_time: null,
            })
        ).toEqual(result);
    });
    it('should return an object with defined start_time when start_date is not 0', async () => {
        expect(
            await onChangeStartDate({
                ...trade_store,
                start_date: 1701388800,
                start_time: '22:05',
            })
        ).toEqual({
            contract_start_type: 'forward',
            duration_units_list: [],
            duration_min_max: {},
            start_time: '22:05',
            expiry_date: null,
            expiry_type: null,
        });
    });
});

describe('onChangeExpiry', () => {
    const expiry_date = '2023-12-25';
    const market_open_times = ['00:00:00'];
    const market_close_times = ['23:59:59'];

    beforeAll(() => {
        ContractType.buildContractTypesConfig(underlying);
    });

    it('should return an object with expiry_time, market_open_times & market_close_times when expiry_type is endtime', async () => {
        expect(
            await onChangeExpiry({
                ...trade_store,
                expiry_date,
                expiry_type: 'endtime',
            })
        ).toMatchObject({
            expiry_time: '23:59:59',
            market_open_times,
            market_close_times,
        });
    });
    it('should return an object with expiry_time === null, and with market_open_times & market_close_times when expiry_type is duration', async () => {
        expect(
            await onChangeExpiry({
                ...trade_store,
                expiry_date,
                expiry_type: 'duration',
            })
        ).toMatchObject({
            expiry_time: null,
            market_open_times,
            market_close_times,
        });
    });
    it('should return an object with expiry_time === null, and without market_open_times & market_close_times when has no expiry_date', async () => {
        expect(
            await onChangeExpiry({
                ...trade_store,
                expiry_date: null,
            })
        ).toMatchObject({
            expiry_time: null,
        });
    });
});
