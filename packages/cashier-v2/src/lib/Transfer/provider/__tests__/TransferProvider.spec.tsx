import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useExchangeRateSubscription, useTransferBetweenAccounts } from '@deriv/api-v2';
import TransferProvider, { useTransfer } from '../TransferProvider';
import { useExtendedTransferAccounts } from '../../hooks';
import { THooks } from '../../../../hooks/types';
import { TTransferableAccounts } from '../../types';
import { TCurrency } from 'src/types';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useExchangeRateSubscription: jest.fn(),
    useTransferBetweenAccounts: jest.fn(),
}));

jest.mock('../../hooks', () => ({
    ...jest.requireActual('../../hooks'),
    useExtendedTransferAccounts: jest.fn(),
}));

const mockUseExtendedTransferAccounts = useExtendedTransferAccounts as jest.Mock;
const mockUseExchangeRateSubscription = useExchangeRateSubscription as jest.Mock;
const mockUseTransferBetweenAccounts = useTransferBetweenAccounts as jest.Mock;

jest.mock('../../../../components', () => ({
    ...jest.requireActual('../../../../components'),
    getCryptoFiatConverterValidationSchema: jest.fn(params => {
        return params;
    }),
}));

const mockTransferLimits = {
    max: 1000,
    min: 1,
} as THooks.AccountLimits;

const mockAccounts = [
    {
        account_type: 'mt5',
        currency: 'USD',
        loginid: 'CR1',
    },
    {
        account_type: 'binary',
        currency: 'BTC',
        loginid: 'CR3',
    },
    {
        account_type: 'ctrader',
        currency: 'USD',
        loginid: 'CR4',
    },
] as THooks.TransferAccounts;

const mockExtendedAccounts = [
    {
        account_type: 'mt5',
        balance: '100.00',
        currency: 'USD',
        currencyConfig: {
            fractional_digits: 2,
        },
        limits: mockTransferLimits,
        loginid: 'CR1',
    },
    {
        account_type: 'binary',
        balance: '10.00000000',
        currency: 'BTC',
        currencyConfig: {
            fractional_digits: 8,
        },
        limits: mockTransferLimits,
        loginid: 'CR3',
    },
    {
        account_type: 'ctrader',
        balance: '95.00',
        currency: 'USD',
        currencyConfig: {
            fractional_digits: 2,
        },
        limits: mockTransferLimits,
        loginid: 'CR4',
    },
] as TTransferableAccounts;

const mockActiveAccount = {
    account_type: 'mt5',
    loginid: 'CR1',
} as THooks.ActiveAccount;

const mockGetConfig = jest.fn();

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <TransferProvider
            accountLimits={mockTransferLimits}
            accounts={mockAccounts}
            activeAccount={mockActiveAccount}
            getConfig={mockGetConfig}
            refetchAccountLimits={jest.fn()}
        >
            {children}
        </TransferProvider>
    );
};

describe('<TransferProvider />', () => {
    beforeEach(() => {
        mockUseExtendedTransferAccounts.mockReturnValue({ accounts: mockExtendedAccounts });

        mockUseTransferBetweenAccounts.mockReturnValue({
            data: 'transfer-between-accounts-data',
            mutate: jest.fn(),
            mutateAsync: jest.fn(),
        });

        mockUseExchangeRateSubscription.mockReturnValue({
            isSubscribed: false,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });

    it('should test whether all transferable accounts are loaded on initial render', async () => {
        const { result } = renderHook(useTransfer, { wrapper });

        await waitFor(() => {
            expect(result.current.accounts).toEqual(mockExtendedAccounts);
        });
    });

    it('should test whether the correct validation schema is set', async () => {
        const { result } = renderHook(useTransfer, { wrapper });

        act(() => {
            result.current.setTransferValidationSchema(mockExtendedAccounts[0], mockExtendedAccounts[1]);
        });

        await waitFor(() => {
            expect(result.current.transferValidationSchema).toEqual({
                fromAccount: {
                    balance: 100,
                    currency: 'USD',
                    fractionalDigits: 2,
                    limits: {
                        max: 1000,
                        min: 1,
                    },
                },
                toAccount: {
                    currency: 'BTC',
                    fractionalDigits: 8,
                },
            });
        });
    });

    it('should check if subscribeToExchangeRate subscribes to exchange rate if already not subscribed', () => {
        const mockSubscribe = jest.fn((base_currency, loginid, target_currency) => {});

        mockUseExchangeRateSubscription.mockReturnValue({
            isSubscribed: false,
            subscribe: mockSubscribe,
            unsubscribe: jest.fn(),
        });

        const { result } = renderHook(useTransfer, { wrapper });

        result.current.subscribeToExchangeRate(
            mockExtendedAccounts[0].currency as TCurrency,
            mockExtendedAccounts[1].currency as TCurrency,
            mockExtendedAccounts[0].loginid
        );

        expect(mockSubscribe).toBeCalledWith({
            base_currency: mockExtendedAccounts[0].currency as TCurrency,
            target_currency: mockExtendedAccounts[1].currency as TCurrency,
            loginid: mockExtendedAccounts[0].loginid,
        });
    });

    it('should check if subscribeToExchangeRate resubscribes to exchange rate properly', async () => {
        const mockSubscribe = jest.fn((base_currency, loginid, target_currency) => {});
        const mockUnsubscribe = jest.fn();

        mockUseExchangeRateSubscription.mockReturnValue({
            isSubscribed: true,
            subscribe: mockSubscribe,
            unsubscribe: mockUnsubscribe,
        });

        const { result } = renderHook(useTransfer, { wrapper });

        result.current.subscribeToExchangeRate(
            mockExtendedAccounts[1].currency as TCurrency,
            mockExtendedAccounts[0].currency as TCurrency,
            mockExtendedAccounts[1].loginid
        );

        await expect(mockUnsubscribe).toBeCalled();

        expect(mockSubscribe).toBeCalledWith({
            base_currency: mockExtendedAccounts[1].currency as TCurrency,
            target_currency: mockExtendedAccounts[0].currency as TCurrency,
            loginid: mockExtendedAccounts[1].loginid,
        });
    });

    it('should check if requestForTransfer() sets the transferReceipt state with correct data', async () => {
        mockUseExchangeRateSubscription.mockReturnValue({
            isSubscribed: true,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
        mockUseTransferBetweenAccounts.mockReturnValue({
            data: 'transfer-between-accounts-data',
            mutate: jest.fn(),
            mutateAsync: jest.fn(({ accounts, account_from, account_to, amount, currency }) =>
                Promise.resolve(
                    accounts === 'all'
                        ? {
                              mockAccounts,
                          }
                        : {
                              fromAccount: mockAccounts[0],
                              toAccount: mockAccounts[1],
                          }
                )
            ),
        });

        const { result } = renderHook(useTransfer, { wrapper });

        act(() => {
            result.current.requestForTransfer('1.00', mockExtendedAccounts[0], mockExtendedAccounts[1]);
        });

        await waitFor(() => {
            expect(result.current.transferReceipt).toEqual({
                amount: '1.00',
                fromAccount: mockExtendedAccounts[0],
                toAccount: mockExtendedAccounts[1],
            });
        });
    });

    it('should check if requestForTransfer() if the updated list of all the accounts is fetched before showing the transferReceipt', async () => {
        mockUseExchangeRateSubscription.mockReturnValue({
            data: {
                rates: {
                    BTC: '0.5',
                },
            },
            isSubscribed: true,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
        mockUseTransferBetweenAccounts.mockReturnValue({
            data: 'transfer-between-accounts-data',
            mutate: jest.fn(),
            mutateAsync: jest.fn(({ accounts, account_from, account_to, amount, currency }) =>
                Promise.resolve(
                    accounts === 'all'
                        ? {
                              mockAccounts,
                          }
                        : {
                              fromAccount: mockAccounts[0],
                              toAccount: mockAccounts[1],
                          }
                )
            ),
        });

        const { result } = renderHook(useTransfer, { wrapper });

        act(() => {
            result.current.requestForTransfer('1.00', mockExtendedAccounts[0], mockExtendedAccounts[1]);
        });

        await waitFor(() => {
            expect(result.current.accounts).toEqual(mockExtendedAccounts);
        });
    });
});
