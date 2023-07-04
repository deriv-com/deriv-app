import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
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
        mocked_props = {
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CRW123123',
            is_virtual: true,
            is_selected: false,
            is_demo: true,
            is_malta_wallet: false,
            gradient_header_class: 'wallet-header__usd-bg',
            gradient_card_class: 'wallet-card__usd-bg',
        };
    });
    it('Check class for NOT demo', () => {
        mocked_props.is_virtual = false;

        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );
        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        mocked_props.is_virtual = true;

        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    // it('Check content appears after arrow button click', async () => {
    //     mockedRootStore.client.loginid = 'CRW2';
    //     mocked_props.is_selected = false;

    //     render(
    //         <StoreProvider store={mockedRootStore}>
    //             <Wallet wallet_account={mocked_props} />
    //         </StoreProvider>
    //     );

    //     const arrow_icon = screen.getByTestId('dt_arrow');
    //     expect(screen.queryByText('wallet test content')).not.toBeInTheDocument();
    //     userEvent.click(arrow_icon);

    //     expect(mockedRootStore.client.switchAccount).toBeCalledTimes(1);
    //     mockedRootStore.client.loginid = 'CRW123123';
    //     mocked_props.is_selected = true;

    //     // rerender component because props are changed
    //     render(
    //         <StoreProvider store={mockedRootStore}>
    //             <Wallet wallet_account={mocked_props} />
    //         </StoreProvider>
    //     );

    //     const content = screen.queryByText('wallet test content');
    //     expect(content).toBeInTheDocument();
    // });

    it('Check for demo wallet header', () => {
        mocked_props.is_virtual = true;

        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={mocked_props} />
            </StoreProvider>
        );

        const currency_card = screen.queryByTestId(`dt_demo`);
        expect(currency_card).toBeInTheDocument();
    });
});
