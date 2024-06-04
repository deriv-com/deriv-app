import React from 'react';
import {
    useAccountLimits,
    useActiveAccount,
    useCryptoConfig,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import WithdrawalCryptoProvider, { useWithdrawalCryptoContext } from './WithdrawalCryptoProvider';
import { waitFor } from '@testing-library/react';

jest.mock('@deriv/api-v2', () => ({
    useAccountLimits: jest.fn(),
    useActiveAccount: jest.fn(),
    useCryptoConfig: jest.fn(),
    useCryptoWithdrawal: jest.fn(),
    useCurrencyConfig: jest.fn(),
    useExchangeRateSubscription: jest.fn(),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
}));

const mockUseAccountLimits = useAccountLimits as jest.Mock;
const mockUseActiveAccount = useActiveAccount as jest.Mock;
const mockUseCryptoConfig = useCryptoConfig as jest.Mock;
const mockUseCryptoWithdrawal = useCryptoWithdrawal as jest.Mock;
const mockUseCurrencyConfig = useCurrencyConfig as jest.Mock;
const mockUseExchangeRate = useExchangeRateSubscription as jest.Mock;
const mockUsePOA = usePOA as jest.Mock;
const mockUsePOI = usePOI as jest.Mock;

describe('useWithdrawalCryptoContext', () => {
    beforeEach(() => {
        mockUseAccountLimits.mockReturnValue({});
        mockUseActiveAccount.mockReturnValue({
            data: {
                currency: 'BTC',
                loginid: 'CR1234',
                currency_config: {
                    fractional_digits: 2,
                },
            },
        });
        mockUseCryptoConfig.mockReturnValue({});
        mockUseCryptoWithdrawal.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({}),
        });
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: () => ({
                USD: { fractionalDigits: 2 },
            }),
        });
        mockUseExchangeRate.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            data: {
                rates: {
                    BTC: 1.5,
                },
            },
        });

        mockUsePOA.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        mockUsePOI.mockReturnValue({
            data: {
                is_verified: true,
            },
        });
    });

    afterEach(cleanup);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WithdrawalCryptoProvider setVerificationCode={jest.fn} verificationCode='Abcd1234'>
            {children}
        </WithdrawalCryptoProvider>
    );

    it('should check whether the client is verified', () => {
        mockUsePOA.mockReturnValue({
            data: {
                is_verified: true,
            },
        });
        mockUsePOI.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.isClientVerified).toBe(true);
    });

    it('should check whether the client is not verified', () => {
        mockUsePOA.mockReturnValue({
            data: {
                is_verified: false,
            },
        });
        mockUsePOI.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        const { rerender, result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.isClientVerified).toBe(false);

        mockUsePOA.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        mockUsePOI.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        rerender();
        expect(result.current.isClientVerified).toBe(false);

        mockUsePOA.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        mockUsePOI.mockReturnValue({
            data: {
                is_verified: false,
            },
        });
        expect(result.current.isClientVerified).toBe(false);

        rerender();
    });

    it('should check if getConvertedCryptoAmount returns expected value', () => {
        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.getConvertedCryptoAmount('1.00')).toBe('1.50');
    });

    it('should check if getConvertedCryptoAmount returns empty string if no value is passed', () => {
        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.getConvertedCryptoAmount('')).toBe('');
    });

    it('should check if getConvertedFiatAmount returns expected value', () => {
        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.getConvertedFiatAmount('1.00')).toBe('1');
    });

    it('should check if getConvertedFiatAmount returns empty string if no value is passed', () => {
        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });
        expect(result.current.getConvertedFiatAmount('')).toBe('');
    });

    it('should check if receipt was generated with correct data when requesting for withdrawal', async () => {
        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });

        result.current.requestCryptoWithdrawal({
            address: 'SampleAddress',
            amount: 1234,
        });

        await waitFor(() => {
            expect(result.current.withdrawalReceipt).toEqual({
                address: 'SampleAddress',
                amount: '1234.00',
                fromAccount: {
                    currency: 'BTC',
                    loginid: 'CR1234',
                },
            });
        });
    });
});
