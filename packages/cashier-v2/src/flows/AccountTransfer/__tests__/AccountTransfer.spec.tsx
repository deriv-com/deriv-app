import React from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import AccountTransfer from '../AccountTransfer';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTransferBetweenAccounts: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));

jest.mock('../../../components', () => ({
    ...jest.requireActual('../../../components'),
    PageContainer: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../../lib', () => ({
    ...jest.requireActual('../../../lib'),
    TransferModule: jest.fn(({ accounts }) => <div>TransferModule/{accounts}</div>),
}));

jest.mock('../screens', () => ({
    ...jest.requireActual('../screens'),
    TransferNoAccount: jest.fn(({ accounts, children }) => (
        <div>
            TransferNoAccount/{accounts}
            <div>{children}</div>
        </div>
    )),
}));

const mockAccounts = describe('<AccountTransfer />', () => {
    it('should test if Loader is rendered when accounts have not still loaded', () => {
        (useTransferBetweenAccounts as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        });

        render(<AccountTransfer />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should test if transfer_between_accounts API call is made with to retrieve all the transferable accounts', () => {
        const mockMutate = jest.fn(params => {});

        (useTransferBetweenAccounts as jest.Mock).mockReturnValue({
            mutate: mockMutate,
        });

        render(<AccountTransfer />);

        expect(mockMutate).toBeCalledWith({ accounts: 'all' });
    });

    it('should test if TransferNoAccount and TransferModule are rendered with the correct data', () => {
        (useTransferBetweenAccounts as jest.Mock).mockReturnValue({
            data: {
                accounts: 'transferable-accounts',
            },
            mutate: jest.fn(),
        });

        render(<AccountTransfer />);

        expect(screen.getByText('TransferNoAccount/transferable-accounts')).toBeInTheDocument();
        expect(screen.getByText('TransferModule/transferable-accounts')).toBeInTheDocument();
    });
});
