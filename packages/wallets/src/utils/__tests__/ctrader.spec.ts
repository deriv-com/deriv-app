import { calculateTotalBalance, type CTraderAccount } from '../ctrader';
import '@testing-library/jest-dom';

describe('calculateTotalBalance', () => {
    it('should return "0.00" for an empty list', () => {
        const accounts: CTraderAccount[] = [];
        expect(calculateTotalBalance(accounts)).toBe('0.00');
    });

    it('should correctly calculate the total balance with all numeric balances', () => {
        const accounts: CTraderAccount[] = [
            { display_balance: 100 },
            { display_balance: 200.5 },
            { display_balance: 50 },
        ];
        expect(calculateTotalBalance(accounts)).toBe('350.50');
    });

    it('should correctly calculate the total balance with string balances', () => {
        const accounts: CTraderAccount[] = [
            { display_balance: '100' },
            { display_balance: '200.50' },
            { display_balance: '50' },
        ];
        expect(calculateTotalBalance(accounts)).toBe('350.50');
    });

    it('should handle null and undefined balances', () => {
        const accounts: CTraderAccount[] = [
            { display_balance: 100 },
            { display_balance: null },
            { display_balance: undefined },
            { display_balance: 50 },
        ];
        expect(calculateTotalBalance(accounts)).toBe('150.00');
    });

    it('should handle a mix of numeric and string balances', () => {
        const accounts: CTraderAccount[] = [
            { display_balance: 100 },
            { display_balance: '200.50' },
            { display_balance: '50' },
            { display_balance: 25.25 },
        ];
        expect(calculateTotalBalance(accounts)).toBe('375.75');
    });

    it('should treat missing display_balance as 0', () => {
        const accounts: CTraderAccount[] = [{ display_balance: 100 }, {}, { display_balance: 50 }];
        expect(calculateTotalBalance(accounts)).toBe('150.00');
    });

    it('should handle accounts with non-numeric string balances gracefully', () => {
        const accounts: CTraderAccount[] = [
            { display_balance: 100 },
            { display_balance: 'not-a-number' },
            { display_balance: '50' },
        ];
        expect(calculateTotalBalance(accounts)).toBe('150.00');
    });
});
