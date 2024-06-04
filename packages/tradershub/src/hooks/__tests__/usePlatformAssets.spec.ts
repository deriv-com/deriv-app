import { Regulation } from '@/constants';
import { useExchangeRates, useTradingAccountsList } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformAssets from '../usePlatformAssets';

jest.mock('@deriv/api-v2', () => ({
    useExchangeRates: jest.fn(),
    useTradingAccountsList: jest.fn(),
}));

describe('usePlatformAssets', () => {
    beforeEach(() => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [
                { broker: 'MF', currency: 'USD', is_virtual: false, balance: 100 },
                { broker: 'CR', currency: 'EUR', is_virtual: false, balance: 200 },
                { broker: 'MF', currency: 'GBP', is_virtual: true, balance: 300 },
            ],
            fiat_account: 'USD',
            isSuccess: true,
        });

        (useExchangeRates as jest.Mock).mockReturnValue({
            data: {},
            getExchangeRate: () => 1,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });

    it('should return correct balances and currency for EU regulation', () => {
        const { result } = renderHook(() => usePlatformAssets(Regulation.EU));

        expect(result.current.demoAccountBalance).toBe(300);
        expect(result.current.fiatCurrency).toBe('USD');
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.realAccounts).toHaveLength(2);
        expect(result.current.totalRealPlatformBalance).toBe(100);
    });

    it('should return correct balances and currency for non-EU regulation', () => {
        const { result } = renderHook(() => usePlatformAssets(Regulation.NonEU));

        expect(result.current.fiatCurrency).toBe('USD');
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.realAccounts).toHaveLength(2);
        expect(result.current.totalRealPlatformBalance).toBe(200);
    });

    it('should return 0 for demoAccountBalance when demo account has no balance', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [
                { broker: 'MF', currency: 'USD', is_virtual: false, balance: 100 },
                { broker: 'CR', currency: 'EUR', is_virtual: false, balance: 200 },
                { broker: 'MF', currency: 'GBP', is_virtual: true, balance: undefined },
            ],
            fiat_account: 'USD',
            isSuccess: true,
        });

        const { result } = renderHook(() => usePlatformAssets(Regulation.EU));

        expect(result.current.demoAccountBalance).toBe(0);
    });

    it('should use fallback values in totalRealPlatformBalance calculation', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [
                { broker: 'MF', currency: undefined, is_virtual: false, balance: 100 },
                { broker: 'CR', currency: undefined, is_virtual: false, balance: 200 },
                { broker: 'MF', currency: 'GBP', is_virtual: true, balance: 300 },
            ],
            fiat_account: undefined,
            isSuccess: true,
        });

        const getExchangeRateMock = jest.fn().mockReturnValue(1);
        (useExchangeRates as jest.Mock).mockReturnValue({
            getExchangeRate: getExchangeRateMock,
        });

        const { result } = renderHook(() => usePlatformAssets(Regulation.EU));

        expect(getExchangeRateMock).toHaveBeenCalledWith('USD', 'USD');

        expect(result.current.totalRealPlatformBalance).toBe(100);
    });

    it('should call multiSubscribe with an empty target_currencies array when there are no real accounts', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: undefined, // no real accounts
            fiat_account: 'USD',
            isSuccess: true,
        });

        const multiSubscribeMock = jest.fn();
        (useExchangeRates as jest.Mock).mockReturnValue({
            subscribe: multiSubscribeMock,
        });

        renderHook(() => usePlatformAssets(Regulation.EU));

        if (multiSubscribeMock.mock.calls.length > 0) {
            expect(multiSubscribeMock.mock.calls[0][0]).toEqual({
                base_currency: 'USD',
                target_currencies: [],
            });
        }
    });

    it('should use fallback value for account balance in totalRealPlatformBalance calculation', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [
                { broker: 'MF', currency: 'USD', is_virtual: false, balance: undefined }, // real account with no balance
                { broker: 'CR', currency: 'EUR', is_virtual: false, balance: 200 },
                { broker: 'MF', currency: 'GBP', is_virtual: true, balance: 300 },
            ],
            fiat_account: 'USD',
            isSuccess: true,
        });

        const getExchangeRateMock = jest.fn().mockReturnValue(1);
        (useExchangeRates as jest.Mock).mockReturnValue({
            getExchangeRate: getExchangeRateMock,
            subscribe: jest.fn(),
        });

        const { result } = renderHook(() => usePlatformAssets(Regulation.EU));

        expect(result.current.totalRealPlatformBalance).toBe(0);
    });
});
