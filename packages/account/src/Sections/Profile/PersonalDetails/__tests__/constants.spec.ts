import { account_opening_reason_list, salutation_list } from '../constants';

describe('Constants File', () => {
    it('should have the expected properties and values for account_opening_reason_list', () => {
        expect(account_opening_reason_list).toEqual([
            { text: 'Speculative', value: 'Speculative' },
            { text: 'Income Earning', value: 'Income Earning' },
            { text: 'Hedging', value: 'Hedging' },
        ]);
    });

    it('should have the expected properties and values for salutation_list', () => {
        expect(salutation_list).toEqual([
            { text: 'Mr', value: 'Mr' },
            { text: 'Mrs', value: 'Mrs' },
            { text: 'Ms', value: 'Ms' },
            { text: 'Miss', value: 'Miss' },
        ]);
    });
});
