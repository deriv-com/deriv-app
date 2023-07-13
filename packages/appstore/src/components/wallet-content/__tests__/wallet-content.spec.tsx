import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletContent from '../wallet-content';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

jest.mock('./../../containers/currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletsList: jest.fn(),
}));

jest.mock('../wallet-cfds-listing', () => jest.fn(() => <div> WalletCFDListing</div>));

describe('<WalletContent />', () => {
    let mocked_props: Writeable<DeepPartial<TWalletAccount>>;
    beforeEach(() => {
        mocked_props = {
            is_demo: false,
            currency: 'USD',
            landing_company_name: 'svg',
            balance: 10000,
            loginid: 'CR123123',
            is_malta_wallet: false,
            is_selected: false,
            icon: 'USD',
            gradient_header_class: 'wallet-header__usd-bg',
            gradient_card_class: 'wallet-card__usd-bg',
            wallet_currency_type: 'USD',
        };
    });
    it('Check class', () => {
        mocked_props.landing_company_name = 'malta';
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_props as TWalletAccount} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');
        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).not.toHaveClass('wallet-content__demo');
    });

    it('Check class for demo', () => {
        mocked_props.is_demo = true;
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_props as TWalletAccount} />
            </StoreProvider>
        );

        const wrapper = screen.queryByTestId('dt_wallet-content');
        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).toHaveClass('wallet-content__demo');
    });

    it('Check there is NOT disclaimer for demo', () => {
        mocked_props.is_demo = true;
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_props as TWalletAccount} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is NOT disclaimer for Non-EU', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_props as TWalletAccount} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is disclaimer for EU and not demo', () => {
        mocked_props.landing_company_name = 'malta';
        mocked_props.is_malta_wallet = true;
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletContent wallet_account={mocked_props as TWalletAccount} />
            </StoreProvider>
        );

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).toBeInTheDocument();
    });
});
