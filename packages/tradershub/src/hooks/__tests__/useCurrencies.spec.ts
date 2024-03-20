import { useAuthorize, useLandingCompany, useQuery } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencies from '../useCurrencies';
import useRegulationFlags from '../useRegulationFlags';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(),
    useQuery: jest.fn(),
    useLandingCompany: jest.fn(),
}));

jest.mock('../useRegulationFlags', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useCurrencies', () => {
    const mockAuthorizeData = {
        account_list: [
            { currency: 'USD' },
            { currency: 'EUR' },
            // Add more mock account data as needed for your test cases
        ],
        currency: 'USD',
    };

    const mockWebsiteStatusData = {
        website_status: {
            currencies_config: {
                USD: { type: 'fiat' },
                EUR: { type: 'fiat' },
                BTC: { type: 'crypto' },
                ETH: { type: 'crypto' },
            },
        },
    };

    const mockLandingCompanyData = {
        gaming_company: {
            legal_allowed_currencies: ['USD', 'EUR'],
        },
        financial_company: {
            legal_allowed_currencies: ['USD', 'EUR'],
        },
    };

    beforeEach(() => {
        (useAuthorize as jest.Mock).mockReturnValue({
            data: mockAuthorizeData,
            isLoading: false,
            isSuccess: true,
        });
        (useQuery as jest.Mock).mockReturnValue({
            data: mockWebsiteStatusData,
            isLoading: false,
        });
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: mockLandingCompanyData,
            isLoading: false,
        });
        (useRegulationFlags as jest.Mock).mockReturnValue({ isNonEU: true });
    });

    it('should return currency data based on dependencies', () => {
        (useRegulationFlags as jest.Mock).mockReturnValue({ isNonEU: false });
        const { result } = renderHook(() => useCurrencies());

        expect(result.current.data).toEqual({
            FIAT: [
                { type: 'fiat', id: 'USD', isAdded: true },
                { type: 'fiat', id: 'EUR', isAdded: true },
            ],
            CRYPTO: [],
        });

        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.currentAccountCurrencyConfig).toBeDefined();
        expect(result.current.currentAccountCurrencyConfig?.id).toEqual('USD');

        expect(result.current.addedFiatCurrency).toBeDefined();
        expect(result.current.addedFiatCurrency?.id).toEqual('USD');
    });

    it('should return true for allCryptoCurrenciesAreAdded when all crypto currencies are added to the account list', () => {
        const mockAuthorizeDataWithCrypto = {
            ...mockAuthorizeData,
            account_list: [
                ...mockAuthorizeData.account_list,
                { currency: 'BTC' }, // Add BTC account to simulate all crypto currencies added
            ],
        };
        (useAuthorize as jest.Mock).mockReturnValue({
            data: mockAuthorizeDataWithCrypto,
            isLoading: false,
            isSuccess: true,
        });
        const { result } = renderHook(() => useCurrencies());
        expect(result.current.allCryptoCurrenciesAreAdded).toBeTruthy();
    });

    it('should return undefined for currentAccountCurrencyConfig when authorizeData.currency is not set', () => {
        const mockAuthorizeDataWithoutCurrency = {
            ...mockAuthorizeData,
            currency: undefined,
        };
        (useAuthorize as jest.Mock).mockReturnValue({
            data: mockAuthorizeDataWithoutCurrency,
            isLoading: false,
            isSuccess: true,
        });
        const { result } = renderHook(() => useCurrencies());
        expect(result.current.currentAccountCurrencyConfig).toBeUndefined();
    });

    it('should return undefined for addedFiatCurrency when no fiat currency is added to the account list', () => {
        const mockAuthorizeDataWithoutFiat = {
            ...mockAuthorizeData,
            account_list: [
                { currency: 'BTC' }, // Add BTC account to simulate no fiat currency added
            ],
        };
        (useAuthorize as jest.Mock).mockReturnValue({
            data: mockAuthorizeDataWithoutFiat,
            isLoading: false,
            isSuccess: true,
        });
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: {
                gaming_company: {
                    legal_allowed_currencies: ['USD', 'EUR', 'BTC', 'ETH'],
                },
            },
            isLoading: false,
        });
        const { result } = renderHook(() => useCurrencies());
        expect(result.current.addedFiatCurrency).toBeUndefined();
    });

    it('should return true for isLoading when at least one hook is in loading state', () => {
        (useAuthorize as jest.Mock).mockReturnValue({
            data: mockAuthorizeData,
            isLoading: true,
            isSuccess: false,
        });
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        });
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        });
        const { result } = renderHook(() => useCurrencies());
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.data).toBeUndefined();
    });
});
