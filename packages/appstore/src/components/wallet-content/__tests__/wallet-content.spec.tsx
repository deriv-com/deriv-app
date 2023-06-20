import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletContent from '../wallet-content';

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

jest.mock('./../../containers/currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));

describe('<WalletContent />', () => {
    it('Check class', () => {
        const mocked_data = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'malta',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'malta',
        };
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_data} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');

        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).not.toHaveClass('wallet-content__demo');
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
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_data} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');

        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).toHaveClass('wallet-content__demo');
    });

    // data-testid='dt_disclaimer_wrapper'
    it('Check there is NOT disclaimer for demo', () => {
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
                <WalletContent wallet_account={mocked_data} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is NOT disclaimer for Non-EU', () => {
        const mocked_data = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'svg',
        };
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_data} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is disclaimer for EU and not demo', () => {
        const mocked_data = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'malta',
            balance: 10000,
            loginid: 'CR123123',
            landing_company_shortcode: 'malta',
        };
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_data} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).toBeInTheDocument();
    });
});
