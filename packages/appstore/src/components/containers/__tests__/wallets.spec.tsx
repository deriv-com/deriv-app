import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import Wallet from '../wallet';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({});

// jest.mock('react-transition-group', () => ({
//     CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
// }));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
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

    // TODO: I'll repair this test a little later
    // it('Check content appears after arrow button click', async () => {
    //     mockedRootStore.client.loginid = 'CRW87654';

    //     render(
    //         <StoreProvider store={mockedRootStore}>
    //             <Wallet wallet_account={mocked_props} />
    //         </StoreProvider>
    //     );

    //     const arrow_icon = screen.getByTestId('dt_arrow');
    //     expect(screen.queryByText('wallet test content')).not.toBeInTheDocument();
    //     userEvent.click(arrow_icon);

    //     await waitFor(() => {
    //         mockedRootStore.client.loginid = 'CRW123123';
    //     });
    //     // console.log('mockedRootStore.client.loginid = ', mockedRootStore.client.loginid);
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
