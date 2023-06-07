import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TCoreStores } from '@deriv/stores/types';
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

const wallet_account: TCoreStores['client']['accounts'][0] = {
    balance: 10415.24,
    currency: 'USD',
    landing_company_shortcode: 'svg',
    is_virtual: 1,
    loginid: 'CRW12345',
};

describe('<WalletContent />', () => {
    it('Check class', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={wallet_account} is_demo={false} is_eu={false} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');

        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).not.toHaveClass('wallet-content__demo');
    });

    it('Check class for demo', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={wallet_account} is_demo={true} is_eu={false} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');

        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).toHaveClass('wallet-content__demo');
    });

    // data-testid='dt_disclaimer_wrapper'
    it('Check there is NOT disclaimer for demo', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={wallet_account} is_demo={true} is_eu={false} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is NOT disclaimer for Non-EU', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={wallet_account} is_demo={false} is_eu={false} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is disclaimer for EU and not demo', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={wallet_account} is_demo={false} is_eu={true} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).toBeInTheDocument();
    });
});
