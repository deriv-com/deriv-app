import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import Wallet from '../wallet';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('./../currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('./../../wallet-content', () => jest.fn(() => <span>wallet test content</span>));

let wallet_account: TWalletAccount;

describe('<Wallets />', () => {
    beforeEach(
        () =>
            (wallet_account = {
                name: 'Demo',
                currency: 'USD',
                icon: '',
                balance: 10784,
                icon_type: 'fiat',
                landing_company_shortcode: 'svg',
                is_disabled: false,
                is_virtual: true,
                loginid: 'CRW10001',
            })
    );

    it('Check class for NOT demo', () => {
        wallet_account.is_virtual = false;

        const Wrapper = () => {
            const [is_open, wrapperSetIsOpen] = React.useState(false);

            return (
                <StoreProvider store={mockedRootStore}>
                    <Wallet
                        wallet_account={wallet_account}
                        is_open_wallet={is_open}
                        setIsOpenWallet={wrapperSetIsOpen}
                    />
                </StoreProvider>
            );
        };

        const { container } = render(<Wrapper />);

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        const Wrapper = () => {
            const [is_open, wrapperSetIsOpen] = React.useState(false);

            return (
                <StoreProvider store={mockedRootStore}>
                    <Wallet
                        wallet_account={wallet_account}
                        is_open_wallet={is_open}
                        setIsOpenWallet={wrapperSetIsOpen}
                    />
                </StoreProvider>
            );
        };

        const { container } = render(<Wrapper />);

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    it('Check content appears after arrow button click', async () => {
        const Wrapper = () => {
            const [is_open, wrapperSetIsOpen] = React.useState(false);

            return (
                <StoreProvider store={mockedRootStore}>
                    <Wallet
                        wallet_account={wallet_account}
                        is_open_wallet={is_open}
                        setIsOpenWallet={wrapperSetIsOpen}
                    />
                </StoreProvider>
            );
        };

        render(<Wrapper />);

        const btn_arrow = screen.getByTestId('dt_arrow');
        expect(screen.queryByText('wallet test content')).not.toBeInTheDocument();
        expect(btn_arrow).toBeInTheDocument();

        await userEvent.click(btn_arrow);
        expect(screen.queryByText('wallet test content')).toBeInTheDocument();
    });

    it('Check for demo wallet header', () => {
        const Wrapper = () => {
            const [is_open, wrapperSetIsOpen] = React.useState(false);

            return (
                <StoreProvider store={mockedRootStore}>
                    <Wallet
                        wallet_account={wallet_account}
                        is_open_wallet={is_open}
                        setIsOpenWallet={wrapperSetIsOpen}
                    />
                </StoreProvider>
            );
        };

        render(<Wrapper />);

        const currency_card = screen.queryByTestId(`dt_demo`);

        expect(currency_card).toBeInTheDocument();
    });
});
