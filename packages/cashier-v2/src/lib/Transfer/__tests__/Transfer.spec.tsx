import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { useAccountLimits, useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import { useTransfer } from '../provider';
import TransferModule from '../Transfer';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAccountLimits: jest.fn(() => ({})),
    useActiveAccount: jest.fn(() => ({})),
    useCurrencyConfig: jest.fn(() => ({})),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));

jest.mock('../../../components', () => ({
    ...jest.requireActual('../../../components'),
    ErrorDialog: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferForm: jest.fn(() => <div>TransferForm</div>),
    TransferReceipt: jest.fn(({ data }) => <div>TransferReceipt={data}</div>),
}));

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    TransferProvider: jest.fn(({ accountLimits, accounts, activeAccount, getConfig, children }) => {
        return (
            <div>
                {accountLimits}/{accounts}/{activeAccount}/{getConfig()}
                <div>{children}</div>
            </div>
        );
    }),
    useTransfer: jest.fn(() => ({})),
}));

const mockTransferAccounts = 'transfer-accounts-data' as unknown as THooks.TransferAccounts;

const mockActiveAccount = 'active-accounts-data' as unknown as THooks.TransferAccounts;

describe('<Transfer />', () => {
    afterEach(cleanup);

    it('should check if the loader is rendered until all the responses for APIs have been received', () => {
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            isLoading: true,
        });
        render(<TransferModule />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should test if the correct values are passed to TransferProvider', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: 'active-account-data',
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            data: 'currencyConfig',
            getConfig: jest.fn(() => 'currency-config-data'),
            isLoading: false,
        });
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: 'account-limits-data',
        });

        render(<TransferModule accounts={'transfer-accounts-data' as unknown as THooks.TransferAccounts} />);

        expect(
            screen.getByText(`account-limits-data/transfer-accounts-data/active-account-data/currency-config-data`)
        ).toBeInTheDocument();
    });

    it('should test if the TransferReceipt is displayed upon successful transfer', () => {
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            data: 'currencyConfig',
            getConfig: jest.fn(),
            isLoading: false,
        });
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: 'accountLimits',
        });
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: mockActiveAccount,
        });
        (useTransfer as jest.Mock).mockReturnValue({
            transferReceipt: {
                data: 'transfer-receipt-data',
            },
        });

        render(<TransferModule accounts={mockTransferAccounts} />);

        expect(screen.getByText('TransferReceipt=transfer-receipt-data')).toBeInTheDocument();
    });

    it('should test if the TransferForm is displayed given transfer is yet to be done', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: mockActiveAccount,
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            data: 'currencyConfig',
            getConfig: jest.fn(),
            isLoading: false,
        });
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: 'accountLimits',
        });
        (useTransfer as jest.Mock).mockReturnValue({});

        render(<TransferModule accounts={mockTransferAccounts} />);

        expect(screen.getByText('TransferForm')).toBeInTheDocument();
    });

    it('should test if the ErrorDialog is displayed upon API error', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: mockActiveAccount,
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            data: 'currencyConfig',
            getConfig: jest.fn(),
            isLoading: false,
        });
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: 'accountLimits',
        });
        (useTransfer as jest.Mock).mockReturnValue({
            transferError: {
                error: {
                    message: 'Unsuccessful transfer (fake error)',
                },
            },
        });

        render(<TransferModule accounts={mockTransferAccounts} />);

        expect(screen.getByText('Unsuccessful transfer (fake error)')).toBeInTheDocument();
    });
});
