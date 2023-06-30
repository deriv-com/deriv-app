import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import Wallet from '../wallet';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

jest.mock('react-transition-group', () => ({
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletModalActionHandler: jest.fn(() => ({ setWalletModalActiveTabIndex: jest.fn(), handleAction: jest.fn() })),
}));

jest.mock('./../currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('./../../wallet-content', () => jest.fn(() => <span>wallet test content</span>));

describe('<Wallets />', () => {
    let mocked_props: TWalletAccount;
    beforeEach(() => {
        mocked_props = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            is_malta_wallet: false,
            is_selected: false,
            gradient_header_class: 'wallet-header__usd-bg',
            gradient_card_class: 'wallet-card__usd-bg',
        };
    });
    it('Check class for NOT demo', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );
        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        mocked_props.is_demo = true;
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    it('Should show content when button is clicked ', async () => {
        mocked_props.is_demo = true;
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );

        const arrow_icon = screen.getByTestId('dt_arrow');

        userEvent.click(arrow_icon);
        await waitFor(() => {
            mockedRootStore.client.loginid = 'CR123123';
        });
        expect(screen.queryByText('wallet test content')).toBeInTheDocument();
    });

    it('Check for demo wallet header', () => {
        mocked_props.is_demo = true;
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );
        const currency_card = screen.queryByTestId(`dt_demo`);
        expect(currency_card).toBeInTheDocument();
    });
});
