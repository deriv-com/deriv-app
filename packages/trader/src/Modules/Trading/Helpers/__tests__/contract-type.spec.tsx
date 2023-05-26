import React from 'react';
import { localize } from '@deriv/translations';
import { getContractTypeCategoryIcons } from '../contract-type';

const contract_types_test_list = {
    Accumulators: { name: 'Accumulators', categories: [{ value: 'accumulator', text: 'Accumulator' }] },
    Digits: { name: 'Digits', categories: [{ value: 'match_diff', text: 'Matches/Differs' }] },
    'Ins & Outs': { name: 'Ins & Outs', categories: [{ value: 'end', text: 'Ends In/Ends Out' }] },
};
const unsupported_test_list = ['end', 'stay'];

describe('getContractTypeCategoryIcons', () => {
    it('should return an object with specific fields (like All, Options , Multipliers and etc.)', () => {
        expect(getContractTypeCategoryIcons()).ALL.toEqual('IcCatAll');
    });
});
