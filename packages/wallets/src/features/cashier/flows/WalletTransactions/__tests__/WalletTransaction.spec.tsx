import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletTransactions from '../WalletTransactions';

const mockSwitchAccount = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(() => ({ switchAccount: mockSwitchAccount })),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

jest.mock('../../../modules', () => ({
    TransactionsModule: () => <div data-testid='transactions-module'>Transactions Module</div>,
}));

describe('WalletTransactions', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?loginid=CR42069'),
            writable: true,
        });
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                loginid: 'CR69420',
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
        jest.clearAllMocks();
    });

    it('should render the TransactionsModule component', () => {
        render(<WalletTransactions />);

        expect(screen.getByTestId('transactions-module')).toBeInTheDocument();
        expect(screen.getByTestId('transactions-module')).toHaveTextContent('Transactions Module');
    });

    it('should call switch account for the loginid in url params', () => {
        render(<WalletTransactions />);

        expect(screen.getByTestId('transactions-module')).toBeInTheDocument();
        expect(mockSwitchAccount).toHaveBeenCalledWith('CR42069');
    });

    it('should remove the `loginid` param from the window url', () => {
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');

        render(<WalletTransactions />);

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });
});
