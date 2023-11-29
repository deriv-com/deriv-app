import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import Wallet from '../wallet';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({});

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
        // @ts-expect-error need to give a value to all props
        mocked_props = {
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CRW123123',
            is_selected: false,
            is_demo: true,
            is_malta_wallet: false,
            gradient_header_class: 'wallet-header__usd-bg',
            gradient_card_class: 'wallet-card__usd-bg',
        };
    });
    it('Check class for NOT demo', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={{ ...mocked_props, is_demo: false }} />
            </StoreProvider>
        );
        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={{ ...mocked_props, is_demo: true }} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    it('Check for demo wallet header', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={{ ...mocked_props, is_demo: true }} />
            </StoreProvider>
        );

        const currency_card = screen.queryByTestId('dt_demo');
        expect(currency_card).toBeInTheDocument();
    });
});
