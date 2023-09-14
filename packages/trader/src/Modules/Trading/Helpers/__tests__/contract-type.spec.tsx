import {
    getContractTypeCategoryIcons,
    getAvailableContractTypes,
    getContractCategoryKey,
    getContractTypes,
} from '../contract-type';

const contract_types_test_list = {
    Accumulators: { name: 'Accumulators', categories: [{ value: 'accumulator', text: 'Accumulators' }] },
    Digits: { name: 'Digits', categories: [{ value: 'match_diff', text: 'Matches/Differs' }] },
    'Ins & Outs': { name: 'Ins & Outs', categories: [{ value: 'end', text: 'Ends In/Ends Out' }] },
};
const unsupported_test_list = ['end', 'stay'];
const unsupported_short_test_list = ['stay'];
const contract_type_array = [
    { value: 'accumulator', text: 'Accumulators' },
    { value: 'rise_fall', text: 'Rise/Fall' },
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
        contract_types: [{ value: 'Multipliers', text: 'Multiplierss' }],
        contract_categories: [
            {
                contract_types: [{ value: 'multipliers', text: 'Multipliers' }],
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

describe('getContractTypeCategoryIcons', () => {
    it('should return an object with specific fields (like All, Options , Multipliers and etc.)', () => {
        expect(getContractTypeCategoryIcons().All).toEqual('IcCatAll');
    });
});

describe('getAvailableContractTypes', () => {
    it('should return an object with specific availibale contracts if they are in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)).toHaveLength(2);
    });
    it('should return an object with all availibale contracts if they are not in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_short_test_list)).toHaveLength(3);
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
        expect(getContractCategoryKey(contract_category_list, { value: 'rise_fall' })).toEqual('All');
    });
    it('should return undefined (contract category) if passed item has not the same value as some of the passed list', () => {
        expect(getContractCategoryKey(contract_category_list, { value: 'match_diff' })).toEqual(undefined);
    });
});

describe('getContractTypes', () => {
    it('should return an array with contract types if passed item has the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: 'rise_fall' })).toEqual(contract_type_array);
    });
    it('should return undefined if passed item has not the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: 'match_diff' })).toEqual(undefined);
    });
});
