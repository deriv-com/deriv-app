import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTransferMessageList, useWalletTransfer } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletTransferMessages from '../wallet-transfer-messages';

const mock_from_account = {
    account_type: 'wallet',
    balance: 0,
    currency: 'USD',
    loginid: 'CRW123',
    display_currency_code: 'USD',
    shortcode: 'svg',
} as ReturnType<typeof useWalletTransfer>['from_account'];

const mock_to_account = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    loginid: 'CR123',
    display_currency_code: 'USD',
    shortcode: 'svg',
} as ReturnType<typeof useWalletTransfer>['to_account'];

const mock_store = mockStore({});

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useTransferMessageList: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    AnimatedList: jest.fn(({ children }) => <div>{children}</div>),
}));

const mockUseTransferMessageList = useTransferMessageList as jest.MockedFunction<typeof useTransferMessageList>;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mock_store}>{children}</StoreProvider>
);

describe('<WalletTransferMessages />', () => {
    it('should render the daily transfer limit message for transfer between real wallet and its linked trading account when the to_account is selected', () => {
        mockUseTransferMessageList.mockReturnValue({
            data: [
                {
                    code: 'WalletToTradingAppDailyLimit',
                    is_first_transfer: true,
                    limit: 10000,
                    currency: mock_from_account?.currency,
                    type: 'success',
                },
            ],
        });
        render(<WalletTransferMessages from_account={mock_from_account} to_account={mock_to_account} />, {
            wrapper,
        });
        expect(screen.getByText('The daily transfer limit between your USD Wallet and Deriv Apps is 10,000.00 USD.'));

        mockUseTransferMessageList.mockReturnValue({
            data: [
                {
                    code: 'WalletToTradingAppDailyLimit',
                    is_first_transfer: false,
                    limit: 9000,
                    currency: mock_from_account?.currency,
                    type: 'success',
                },
            ],
        });
        render(<WalletTransferMessages from_account={mock_from_account} to_account={mock_to_account} />, { wrapper });
        expect(
            screen.getByText(
                'The remaining daily transfer limit between your USD Wallet and Deriv Apps is 9,000.00 USD.'
            )
        );
    });

    it('should render the daily transfer limit message for transfer between Demo wallet and its linked Demo trading account when the to_account is selected', () => {
        mockUseTransferMessageList.mockReturnValue({
            data: [
                {
                    code: 'DemoWalletToTradingAppDailyLimit',
                    is_first_transfer: true,
                    limit: 10000,
                    currency: mock_from_account?.currency,
                    type: 'success',
                },
            ],
        });
        render(<WalletTransferMessages from_account={mock_from_account} to_account={mock_to_account} />, {
            wrapper,
        });
        expect(screen.getByText('Your daily transfer limit for virtual funds is 10,000.00 USD.'));

        mockUseTransferMessageList.mockReturnValue({
            data: [
                {
                    code: 'DemoWalletToTradingAppDailyLimit',
                    is_first_transfer: false,
                    limit: 9000,
                    currency: mock_from_account?.currency,
                    type: 'success',
                },
            ],
        });
        render(<WalletTransferMessages from_account={mock_from_account} to_account={mock_to_account} />, { wrapper });
        expect(screen.getByText('Your remaining daily transfer limit for virtual funds is 9,000.00 USD.'));
    });
});
