import { mockStore } from '@deriv/stores';
import { onChangeContractType, onChangeContractTypeList } from '../contract-type';
import { ContractType } from '../../Helpers/contract-type';
import { TRADE_TYPES } from '@deriv/shared';

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
    const common_contracts_for_data = {
        exchange_name: 'RANDOM',
        market: 'synthetic_index',
        start_type: 'spot',
        submarket: 'random_index',
        underlying_symbol: 'R_10',
    };
    const vanilla_contracts_for_data = {
        ...common_contracts_for_data,
        barrier_category: 'euro_non_atm',
        barriers: 1,
        contract_category: 'vanilla',
        contract_category_display: 'Vanilla Options',
    };

    return {
        ...jest.requireActual('@deriv/shared'),
        WS: {
            contractsFor: jest.fn(() =>
                Promise.resolve({
                    contracts_for: {
                        available: [
                            {
                                ...common_contracts_for_data,
                                barrier_category: 'american',
                                barriers: 2,
                                contract_category: 'accumulator',
                                contract_category_display: 'Accumulator',
                                contract_display: 'Accumulator Up',
                                contract_type: 'ACCU',
                                expiry_type: 'no_expiry',
                                growth_rate_range: [0.01, 0.02, 0.03, 0.04, 0.05],
                                high_barrier: barrier_intraday,
                                low_barrier: barrier_intraday,
                                max_contract_duration: '0',
                                min_contract_duration: '0',
                                sentiment: 'low_vol',
                            },
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
        },
    };
});

const accumulators_title = 'Accumulators';
const multipliers_title = 'Multipliers';
const underlying = 'R_10';
const vanillas_title = 'Vanillas';
const call_put = 'Call/Put';

describe('onChangeContractTypeList', () => {
    const trade_store = mockStore({}).modules.trade;
    const accumulators_contract_data = {
        [accumulators_title]: {
            name: accumulators_title,
            categories: [{ value: TRADE_TYPES.ACCUMULATOR, text: accumulators_title }],
        },
    };
    const vanillas_contract_data = {
        [vanillas_title]: {
            name: vanillas_title,
            categories: [
                { value: TRADE_TYPES.VANILLA.CALL, text: call_put },
                {
                    value: TRADE_TYPES.VANILLA.PUT,
                    text: call_put,
                },
            ],
        },
    };

    beforeAll(() => {
        ContractType.buildContractTypesConfig(underlying);
    });

    it('should return the 1st contract_type from contract_types_list if Multipliers are not present in it', () => {
        trade_store.contract_types_list = { ...accumulators_contract_data, ...vanillas_contract_data };
        expect(onChangeContractTypeList(trade_store)).toMatchObject({ contract_type: TRADE_TYPES.ACCUMULATOR });
    });
    it('should return Multipliers contract_type if Multipliers are present in contract_types_list', () => {
        trade_store.contract_types_list = {
            ...vanillas_contract_data,
            [multipliers_title]: {
                name: multipliers_title,
                categories: [{ value: TRADE_TYPES.MULTIPLIER, text: multipliers_title }],
            },
        };
        expect(onChangeContractTypeList(trade_store)).toMatchObject({ contract_type: TRADE_TYPES.MULTIPLIER });
    });
    it('should return an empty object when called with an empty object', () => {
        expect(onChangeContractTypeList({} as typeof trade_store)).toMatchObject({});
    });
});

describe('onChangeContractType', () => {
    const trade_store = mockStore({}).modules.trade;
    const resulting_store = {
        barrier_2: '',
        basis: 'stake',
        basis_list: [
            {
                text: 'Stake',
                value: 'stake',
            },
        ],
        cached_multiplier_cancellation_list: [],
        cancellation_range_list: [],
        contract_start_type: 'spot',
        has_cancellation: false,
        multiplier_range_list: [],
        start_date: 0,
        start_dates_list: [
            {
                text: 'Now',
                value: 0,
            },
        ],
    };

    beforeAll(() => {
        ContractType.buildContractTypesConfig(underlying);
    });

    it('should return an object with correct store values for Vanilla', () => {
        const barrier_1 = '+0.000';
        const barrier_choices = ['-1.230', '-0.650', barrier_1, '+0.650', '+1.230'];
        trade_store.contract_type = TRADE_TYPES.VANILLA.CALL;
        trade_store.strike_price_choices = { barrier: barrier_1, barrier_choices };
        expect(onChangeContractType(trade_store)).toMatchObject({
            ...resulting_store,
            accumulator_range_list: [],
            barrier_1,
            barrier_choices,
            barrier_count: 1,
            duration_min_max: {
                intraday: {
                    max: 86400,
                    min: 60,
                },
            },
            duration_unit: 'm',
            duration_units_list: [
                {
                    text: 'Minutes',
                    value: 'm',
                },
                {
                    text: 'Hours',
                    value: 'h',
                },
                {
                    text: 'Days',
                    value: 'd',
                },
            ],
            expiry_type: 'duration',
            form_components: ['duration', 'amount', 'duration', 'strike', 'amount', 'trade_type_tabs'],
            trade_types: {
                VANILLALONGCALL: 'Vanilla Long Call',
            },
        });
    });
    it('should return an object with correct store values for Accumulators', () => {
        trade_store.contract_type = TRADE_TYPES.ACCUMULATOR;
        expect(onChangeContractType(trade_store)).toMatchObject({
            ...resulting_store,
            accumulator_range_list: [0.01, 0.02, 0.03, 0.04, 0.05],
            barrier_1: '',
            barrier_choices: [],
            barrier_count: 2,
            duration_min_max: {},
            duration_units_list: [],
            expiry_type: null,
            form_components: ['amount', 'take_profit', 'accumulator', 'accu_info_display'],
            trade_types: {
                ACCU: 'Accumulator Up',
            },
        });
    });
    it('should return an empty object when called with an empty object', () => {
        expect(onChangeContractType({} as typeof trade_store)).toMatchObject({});
    });
});
