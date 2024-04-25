import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import TransferProvider, { useTransfer } from '../TransferProvider';
import { useExtendedTransferAccounts } from '../../hooks';
import { THooks } from '../../../../hooks/types';
import { TTransferableAccounts } from '../../types';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTransferBetweenAccounts: jest.fn(() => ({
        data: 'transfer-between-accounts-data',
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
    })),
}));

jest.mock('../../hooks', () => ({
    ...jest.requireActual('../../hooks'),
    useExtendedTransferAccounts: jest.fn(),
}));

const mockUseExtendedTransferAccounts = useExtendedTransferAccounts as jest.Mock;

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
        >
            {children}
        </TransferProvider>
    );
};

describe('<TransferProvider />', () => {
    it('should test whether the correct validation schema is set', async () => {
        mockUseExtendedTransferAccounts.mockReturnValue(mockExtendedAccounts);
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
});
