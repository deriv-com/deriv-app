import React from 'react';
import {
    useAccountLimits,
    useActiveWalletAccount,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import WithdrawalCryptoProvider, { useWithdrawalCryptoContext } from './WithdrawalCryptoProvider';

jest.mock('@deriv/api-v2', () => ({
    useAccountLimits: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCryptoWithdrawal: jest.fn(),
    useCurrencyConfig: jest.fn(),
    useExchangeRateSubscription: jest.fn(),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
}));

const mockUseAccountLimits = useAccountLimits as jest.Mock;
const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;
const mockUseCryptoWithdrawal = useCryptoWithdrawal as jest.Mock;
const mockUseCurrencyConfig = useCurrencyConfig as jest.Mock;
const mockUseExchangeRate = useExchangeRateSubscription as jest.Mock;
const mockUsePOA = usePOA as jest.Mock;
const mockUsePOI = usePOI as jest.Mock;

describe('useWithdrawalCryptoContext', () => {
    beforeEach(() => {
        mockUseAccountLimits.mockReturnValue({});
        mockUseActiveWalletAccount.mockReturnValue({});
        mockUseCryptoWithdrawal.mockReturnValue({});
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: () => ({
                fractionalDigits: 2,
            }),
        });
        mockUseExchangeRate.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WithdrawalCryptoProvider onClose={() => jest.fn()} verificationCode='Abcd1234'>
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
});
