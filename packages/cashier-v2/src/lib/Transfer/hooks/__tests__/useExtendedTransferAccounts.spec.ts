import { renderHook, cleanup } from '@testing-library/react-hooks';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import useExtendedTransferBetweenAccounts from '../useExtendedTransferAccounts';
import { THooks } from '../../../../hooks/types';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
    displayMoney: jest.fn((balance, currency, options) => `${balance}-${currency}-${options.fractional_digits}`),
}));

const mockUnorderedTransferAccounts = [
    { account_type: 'dxtrade', balance: '300', currency: 'USD', loginid: 'CR3' },
    { account_type: 'binary', balance: '600', currency: 'ETH', loginid: 'CR6' },
    { account_type: 'mt5', balance: '100', currency: 'USD', loginid: 'CR1' },
    { account_type: 'binary', balance: '400', currency: 'USD', loginid: 'CR4' },
    { account_type: 'ctrader', balance: '200', currency: 'USD', loginid: 'CR2' },
    { account_type: 'binary', balance: '500', currency: 'BTC', loginid: 'CR5' },
] as THooks.TransferAccounts;

const mockActiveAccount = {
    loginid: 'CR4',
} as THooks.ActiveAccount;

const mockTransferMinMaxLimits = {
    limits: {
        max: 1000,
        min: 1,
    },
    limits_ctrader: {
        max: 400,
        min: 1,
    },
    limits_dxtrade: {
        max: 300,
        min: 1,
    },
    limits_mt5: {
        max: 200,
        min: 1,
    },
};

const getCurrencyConfig = (currency: string) => {
    let is_fiat = false,
        is_crypto = false,
        fractional_digits = 2;
    switch (currency) {
        case 'USD':
            is_fiat = true;
            break;
        case 'BTC':
            is_crypto = true;
            fractional_digits = 8;
            break;
        case 'ETH':
            is_crypto = true;
            fractional_digits = 7;
            break;
    }
    return {
        is_crypto,
        is_fiat,
        fractional_digits,
        transfer_between_accounts: mockTransferMinMaxLimits,
    };
};

describe('useExtendedTransferBetweenAccounts', () => {
    beforeEach(() => {
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: {
                loginid: 'CR4',
            },
            isLoading: false,
        });

        (useCurrencyConfig as jest.Mock).mockReturnValue({
            getConfig: (currency: string) => getCurrencyConfig(currency),
            isLoading: false,
        });
    });
    afterEach(cleanup);

    it('should return the correct authorized account', () => {
        const { result } = renderHook(() =>
            useExtendedTransferBetweenAccounts(
                mockActiveAccount,
                getCurrencyConfig as unknown as THooks.GetCurrencyConfig,
                mockUnorderedTransferAccounts
            )
        );
        expect(result.current.activeAccount?.loginid).toEqual('CR4');
    });

    it('should return the all the accounts in the correct order', () => {
        const { result } = renderHook(() =>
            useExtendedTransferBetweenAccounts(
                mockActiveAccount,
                getCurrencyConfig as unknown as THooks.GetCurrencyConfig,
                mockUnorderedTransferAccounts
            )
        );
        const order = ['CR1', 'CR2', 'CR3', 'CR4', 'CR5', 'CR6'];
        expect(result.current.accounts.map(account => account.loginid)).toEqual(order);
    });

    it('should check if all the accounts contain the correct currency config data', () => {
        const { result } = renderHook(() =>
            useExtendedTransferBetweenAccounts(
                mockActiveAccount,
                getCurrencyConfig as unknown as THooks.GetCurrencyConfig,
                mockUnorderedTransferAccounts
            )
        );
        const mockExpectedTransferAccounts = [
            {
                account_type: 'mt5',
                balance: '100',
                currency: 'USD',
                loginid: 'CR1',
                limits: {
                    max: 200,
                    min: 1,
                },
                currencyConfig: {
                    fractional_digits: 2,
                    is_fiat: true,
                    is_crypto: false,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '100-USD-2',
            },
            {
                account_type: 'ctrader',
                balance: '200',
                currency: 'USD',
                loginid: 'CR2',
                limits: {
                    max: 400,
                    min: 1,
                },
                currencyConfig: {
                    fractional_digits: 2,
                    is_fiat: true,
                    is_crypto: false,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '200-USD-2',
            },
            {
                account_type: 'dxtrade',
                balance: '300',
                currency: 'USD',
                loginid: 'CR3',
                limits: {
                    max: 300,
                    min: 1,
                },
                currencyConfig: {
                    fractional_digits: 2,
                    is_fiat: true,
                    is_crypto: false,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '300-USD-2',
            },
            {
                account_type: 'binary',
                balance: '400',
                currency: 'USD',
                loginid: 'CR4',
                limits: {
                    max: 1000,
                    min: 1,
                },
                currencyConfig: {
                    fractional_digits: 2,
                    is_fiat: true,
                    is_crypto: false,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '400-USD-2',
            },
            {
                account_type: 'binary',
                balance: '500',
                currency: 'BTC',
                loginid: 'CR5',
                limits: {
                    max: 1000,
                    min: 1,
                },
                currencyConfig: {
                    fractional_digits: 8,
                    is_fiat: false,
                    is_crypto: true,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '500-BTC-8',
            },
            {
                account_type: 'binary',
                balance: '600',
                currency: 'ETH',
                limits: {
                    max: 1000,
                    min: 1,
                },
                loginid: 'CR6',
                currencyConfig: {
                    fractional_digits: 7,
                    is_fiat: false,
                    is_crypto: true,
                    transfer_between_accounts: mockTransferMinMaxLimits,
                },
                displayBalance: '600-ETH-7',
            },
        ];
        expect(result.current.accounts).toEqual(mockExpectedTransferAccounts);
    });
});
