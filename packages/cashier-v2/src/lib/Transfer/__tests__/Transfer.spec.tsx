import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAccountLimits, useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import TransferModule from '../Transfer';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAccountLimits: jest.fn(),
    useActiveAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferForm: jest.fn(() => <div>TransferForm</div>),
    TransferReceipt: jest.fn(() => <div>TransferReceipt</div>),
}));

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    TransferProvider: jest.fn(({ accountLimits, accounts, activeAccount, children, getConfig }) => (
        <div>{children}</div>
    )),
}));

const mockTransferAccounts = [
    { account_type: 'dxtrade', balance: '300', currency: 'USD', loginid: 'CR3' },
    { account_type: 'binary', balance: '600', currency: 'ETH', loginid: 'CR6' },
    { account_type: 'mt5', balance: '100', currency: 'USD', loginid: 'CR1' },
    { account_type: 'binary', balance: '400', currency: 'USD', loginid: 'CR4' },
    { account_type: 'ctrader', balance: '200', currency: 'USD', loginid: 'CR2' },
    { account_type: 'binary', balance: '500', currency: 'BTC', loginid: 'CR5' },
] as THooks.TransferAccounts;

const mockActiveAccount = { account_type: 'binary', balance: '400', currency: 'USD', loginid: 'CR4' };

describe('<Transfer />', () => {
    it('should check if the loader is rendered until all the responses for APIs have been received', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({});
        (useActiveAccount as jest.Mock).mockReturnValue({});
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            isLoading: true,
        });
        render(<TransferModule />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should test if the correct values are passed to TransferProvider', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: 'accountLimits',
        });
        (useActiveAccount as jest.Mock).mockReturnValue(mockActiveAccount);
        (useCurrencyConfig as jest.Mock).mockReturnValue({
            data: 'currencyConfig',
            getConfig: jest.fn(),
            isLoading: false,
        });
        render(<TransferModule accounts={mockTransferAccounts} />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });
});
