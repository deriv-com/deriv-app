import React from 'react';
import { getContractTypeCategoryIcons, getAvailableContractTypes } from '../contract-type';

const contract_types_test_list = {
    Accumulators: { name: 'Accumulators', categories: [{ value: 'accumulator', text: 'Accumulator' }] },
    Digits: { name: 'Digits', categories: [{ value: 'match_diff', text: 'Matches/Differs' }] },
    'Ins & Outs': { name: 'Ins & Outs', categories: [{ value: 'end', text: 'Ends In/Ends Out' }] },
};
const unsupported_test_list = ['end', 'stay'];
const unsupported_short_test_list = ['stay'];

describe('getContractTypeCategoryIcons', () => {
    it('should return an object with specific fields (like All, Options , Multipliers and etc.)', () => {
        expect(getContractTypeCategoryIcons().All).toEqual('IcCatAll');
    });
});

describe('getAvailableContractTypes', () => {
    it('should return an object with specific availibale contracts if they are in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list).length).toEqual(2);
    });
    it('should return an object with all availibale contracts if they are not in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_short_test_list).length).toEqual(3);
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
