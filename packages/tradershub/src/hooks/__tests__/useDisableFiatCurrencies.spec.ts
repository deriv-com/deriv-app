import { useAccountStatus, useActiveTradingAccount, useCFDAccountsList, useQuery } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencies from '../useCurrencies';
import useDisableFiatCurrencies from '../useDisableFiatCurrencies';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveTradingAccount: jest.fn(),
    useCFDAccountsList: jest.fn(),
    useQuery: jest.fn(),
    useCurrencies: jest.fn(),
}));

jest.mock('../useCurrencies', () => jest.fn());

describe('useDisableFiatCurrencies', () => {
    const mockData = {
        activeDerivTradingAccount: { balance: 1000 },
        accountStatus: { is_deposit_attempt: true },
        cfdAccountsList: { dxtrade: [], mt5: [] },
        currentAccountCurrencyConfig: { type: 'fiat' },
        addedFiatCurrency: { id: 'USD', type: 'fiat', isAdded: true },
        statements: { statement: { count: 3, transactions: [{}, {}, {}] } },
    };

    beforeEach(() => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: mockData.activeDerivTradingAccount });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockData.accountStatus, isSuccess: true });
        (useCFDAccountsList as jest.Mock).mockReturnValue({ data: mockData.cfdAccountsList });
        (useQuery as jest.Mock).mockReturnValue({ data: mockData.statements });
        (useCurrencies as jest.Mock).mockReturnValue({
            currentAccountCurrencyConfig: mockData.currentAccountCurrencyConfig,
            addedFiatCurrency: mockData.addedFiatCurrency,
        });
    });

    it('should disable fiat currencies based on account status and current account currency', () => {
        const { result } = renderHook(() => useDisableFiatCurrencies());

        expect(result.current).toBe(true);

        (useCurrencies as jest.Mock).mockReturnValue({
            currentAccountCurrencyConfig: { type: 'fiat' },
            addedFiatCurrency: undefined,
        });
        const { result: resultWithBalance } = renderHook(() => useDisableFiatCurrencies());
        expect(resultWithBalance.current).toBe(true);

        (useCurrencies as jest.Mock).mockReturnValue({
            currentAccountCurrencyConfig: { type: 'fiat' },
            addedFiatCurrency: mockData.addedFiatCurrency,
        });
        const { result: resultDepositAttempt } = renderHook(() => useDisableFiatCurrencies());
        expect(resultDepositAttempt.current).toBe(true);
    });

    it('should enable fiat currencies if the current account currency is not fiat', () => {
        (useCurrencies as jest.Mock).mockReturnValue({
            currentAccountCurrencyConfig: { type: 'crypto' },
            addedFiatCurrency: undefined,
        });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_deposit_attempt: false }, isSuccess: true });
        const { result } = renderHook(() => useDisableFiatCurrencies());
        expect(result.current).toBe(false);
    });

    it('should disable fiat currencies if there is no balance and the deposit attempt', () => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { balance: 0 } });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_deposit_attempt: true }, isSuccess: true });
        const { result } = renderHook(() => useDisableFiatCurrencies());
        expect(result.current).toBe(true);
    });

    it('should disable fiat currencies if the current account currency is not fiat and the account is a deposit attempt but there are no MT5 accounts', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_deposit_attempt: true }, isSuccess: true });
        (useCFDAccountsList as jest.Mock).mockReturnValue({ data: { dxtrade: [{}], mt5: undefined } });
        const { result } = renderHook(() => useDisableFiatCurrencies());
        expect(result.current).toBe(true);
    });

    it('should disable fiat currencies if the current account currency is not fiat and the account is a deposit attempt but there are no transactions', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_deposit_attempt: true }, isSuccess: true });
        (useQuery as jest.Mock).mockReturnValue({ data: { statement: { count: 0, transactions: [] } } });
        const { result } = renderHook(() => useDisableFiatCurrencies());
        expect(result.current).toBe(true);
    });

    it('should enable fiat currencies if the current account currency is not fiat and the account is not a deposit attempt', () => {
        (useCurrencies as jest.Mock).mockReturnValue({
            currentAccountCurrencyConfig: { type: 'crypto' },
            addedFiatCurrency: undefined,
        });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_deposit_attempt: false }, isSuccess: true });
        const { result } = renderHook(() => useDisableFiatCurrencies());
        expect(result.current).toBe(false);
    });
});
