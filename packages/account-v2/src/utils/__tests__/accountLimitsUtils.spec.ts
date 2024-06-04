import { mockAccountLimits, mockFormattedAccountsLimits } from '../../mocks/accountLimitsResponse.mock';
import { getAccountLimitValues } from '../accountLimitsUtils';

const currency = 'EUR';

describe('getAccountLimitValues', () => {
    it('should return trading limits table data', () => {
        const result = getAccountLimitValues(mockAccountLimits, currency);
        expect(result).toEqual(mockFormattedAccountsLimits);
    });

    it('should return correct trading limits table data when user authenticated', () => {
        const newAccountLimits = { ...mockAccountLimits, account_balance: 1000 };
        const result = getAccountLimitValues(newAccountLimits, currency, true);
        expect(result).toEqual([
            { category: 'header', title: 'Trading limits', value: 'Limit' },
            {
                hintInfo:
                    'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
                title: '*Maximum number of open positions',
                value: 100,
            },
            {
                hintInfo:
                    'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.',
                title: '*Maximum account cash balance',
                value: '1,000.00',
            },
            {
                hintInfo:
                    'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.',
                title: 'Maximum aggregate payouts on open positions',
                value: '50,000.00',
            },
            {
                category: 'footer',
                title: '*Any limits in your Self-exclusion settings will override these default limits.',
            },
            {
                category: 'header',
                hintInfo: 'Represents the maximum volume of contracts that you may purchase in any given trading day.',
                title: 'Maximum daily turnover',
                value: 'Limit',
            },
            { category: 'market', title: 'Commodities', value: '50,000.00' },
            { category: 'submarket', title: 'Minor Pairs', value: '50,000.00' },
            { category: 'header', title: 'Withdrawal limits', value: 'Limit' },
            {
                category: 'footer',
                isLessProminent: true,
                title: 'Your account is fully authenticated and your withdrawal limits have been lifted',
            },
        ]);
    });
});
