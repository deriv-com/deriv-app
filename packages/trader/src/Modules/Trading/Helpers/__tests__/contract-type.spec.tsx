import { TRADE_TYPES } from '@deriv/shared';
import {
    getContractTypeCategoryIcons,
    getAvailableContractTypes,
    getContractCategoryKey,
    getContractTypes,
    getCategoriesSortedByKey,
    ordered_trade_categories,
} from '../contract-type';

const contract_types_test_list = {
    Accumulators: { name: 'Accumulators', categories: [{ value: TRADE_TYPES.ACCUMULATOR, text: 'Accumulators' }] },
    Digits: { name: 'Digits', categories: [{ value: TRADE_TYPES.MATCH_DIFF, text: 'Matches/Differs' }] },
    'Ins & Outs': { name: 'Ins & Outs', categories: [{ value: TRADE_TYPES.END, text: 'Ends In/Ends Out' }] },
};
const unsupported_test_list: Parameters<typeof getAvailableContractTypes>[1] = [
    TRADE_TYPES.CALL_PUT_SPREAD,
    TRADE_TYPES.RUN_HIGH_LOW,
    TRADE_TYPES.RESET,
    TRADE_TYPES.ASIAN,
    TRADE_TYPES.TICK_HIGH_LOW,
    TRADE_TYPES.END,
    TRADE_TYPES.STAY,
    TRADE_TYPES.LB_CALL,
    TRADE_TYPES.LB_PUT,
    TRADE_TYPES.LB_HIGH_LOW,
];
const contract_type_array = [
    { value: TRADE_TYPES.ACCUMULATOR, text: 'Accumulators' },
    { value: TRADE_TYPES.RISE_FALL, text: 'Rise/Fall' },
];
const contract_category_list = [
    {
        contract_types: contract_type_array,
        contract_categories: [
            {
                contract_types: contract_type_array,
                icon: 'IcCatAll',
                key: 'All',
                label: 'All',
            },
        ],
        icon: 'IcCatAll',
        key: 'All',
        label: 'All',
    },
    {
        contract_types: [{ value: 'Multipliers', text: 'Multipliers' }],
        contract_categories: [
            {
                contract_types: [{ value: TRADE_TYPES.MULTIPLIER, text: 'Multipliers' }],
                icon: 'IcCatMultiplier',
                key: 'Multipliers',
                label: 'Multipliers',
            },
        ],
        icon: 'IcCatMultiplier',
        key: 'Multipliers',
        label: 'Multipliers',
    },
];
const unavailable_trade_types_list = [
    {
        contract_types: [{ text: 'Vanillas', value: 'vanilla' }],
        icon: 'IcVanillas',
        is_unavailable: true,
        key: 'Vanillas',
        label: 'Vanillas',
    },
    {
        contract_types: [{ text: 'Accumulators', value: TRADE_TYPES.ACCUMULATOR }],
        icon: 'IcAccumulators',
        is_unavailable: true,
        key: 'Accumulators',
        label: 'Accumulators',
    },
];

describe('getContractTypeCategoryIcons', () => {
    it('should return an object with specific fields (like All, Options , Multipliers and etc.)', () => {
        expect(getContractTypeCategoryIcons().All).toEqual('IcCatAll');
    });
});

describe('getAvailableContractTypes', () => {
    it('should return an object with specific available contracts if they are in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)).toHaveLength(2);
    });
    it('should return null for component field if it is not Accumulators', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)[1]?.component).toEqual(null);
    });
    it('should return html element for component field if it is Accumulators', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)[0]?.component).not.toEqual(
            null
        );
    });
});

describe('getContractCategoryKey', () => {
    it('should return key (contract category) if passed item has the same value as some of the passed list', () => {
        expect(getContractCategoryKey(contract_category_list, { value: TRADE_TYPES.RISE_FALL })).toEqual('All');
    });
    it('should return undefined (contract category) if passed item has not the same value as some of the passed list', () => {
        expect(getContractCategoryKey(contract_category_list, { value: TRADE_TYPES.MATCH_DIFF })).toEqual(undefined);
    });
});

describe('getContractTypes', () => {
    it('should return an array with contract types if passed item has the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: TRADE_TYPES.RISE_FALL })).toEqual(contract_type_array);
    });
    it('should return undefined if passed item has not the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: TRADE_TYPES.MATCH_DIFF })).toEqual(undefined);
    });
});

describe('getCategoriesSortedByKey', () => {
    it('should return an array with contract type objects sorted based on ordered_trade_categories list', () => {
        expect(getCategoriesSortedByKey(unavailable_trade_types_list)[0].key).toEqual(ordered_trade_categories[0]);
    });
    it('should return an empty array if a list is not received', () => {
        expect(getCategoriesSortedByKey()).toEqual([]);
    });
});
