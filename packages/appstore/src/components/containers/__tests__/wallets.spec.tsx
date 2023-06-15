import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import Wallet from '../wallet';

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

jest.mock('./../currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('./../../wallet-content', () => jest.fn(() => <span>wallet test content</span>));

describe('<Wallets />', () => {
    it('Check class for NOT demo', () => {
        const mocked_data = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'svg',
        };
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet data={mocked_data} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        const mocked_data = {
            is_demo: true,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'svg',
        };
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet data={mocked_data} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    it('Should show content when button is clicked ', async () => {
        const mocked_data = {
            is_demo: true,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'svg',
        };
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet data={mocked_data} />
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
        const mocked_data = {
            is_demo: true,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'svg',
        };
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet data={mocked_data} />
            </StoreProvider>
        );
        const currency_card = screen.queryByTestId(`dt_demo`);

        expect(currency_card).toBeInTheDocument();
    });
});
