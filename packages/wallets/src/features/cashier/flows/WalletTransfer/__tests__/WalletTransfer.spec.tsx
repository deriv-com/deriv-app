import React from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletTransfer from '../WalletTransfer';

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    Loader: jest.fn(() => <div>Loading</div>),
}));

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    TransferModule: jest.fn(({ accounts }) => (
        <>
            <div>TransferModule</div>
            <div>{accounts}-module</div>
        </>
    )),
}));

jest.mock('../../../screens/TransferNotAvailable', () => ({
    ...jest.requireActual('../../../screens/TransferNotAvailable'),
    TransferNotAvailable: jest.fn(({ accounts, children }) => (
        <>
            <div>TransferNotAvailable</div>
            <div>{children}</div>
            <div>{accounts}-screen</div>
        </>
    )),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTransferBetweenAccounts: jest.fn(),
}));

const mockUseTransferBetweenAccounts = useTransferBetweenAccounts as jest.MockedFunction<
    typeof useTransferBetweenAccounts
>;

describe('<WalletTransfer />', () => {
    it('should show the loader if the API response has not yet arrived', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseTransferBetweenAccounts.mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<WalletTransfer />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render the TransferNotAvailable screen and its children as the API response is received', () => {
        mockUseTransferBetweenAccounts.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                accounts: 'transfer-accounts-data-for',
            },
            mutate: jest.fn(),
        });

        render(<WalletTransfer />);
        expect(screen.getByText('TransferNotAvailable')).toBeInTheDocument();
        expect(screen.getByText('TransferModule')).toBeInTheDocument();
        expect(screen.getByText('transfer-accounts-data-for-screen')).toBeInTheDocument();
        expect(screen.getByText('transfer-accounts-data-for-module')).toBeInTheDocument();
    });
});
