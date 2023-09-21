import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletAppCard from '../wallet-app-card';

describe('render <WalletCFDCard />', () => {
    const mockedRootStore = mockStore({});
    const mocked_props = {
        wallet: {
            account_title: 'Success',
            balance: '0.00 USD',
            currency_title: 'USD Wallet',
            gradient_card_class: 'wallet-app-card__bg--gradient-1',
            icon: 'IcUSD',
            is_demo: false,
            wallet_label: 'Real',
        },
    };

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockedRootStore}>{children}</StoreProvider>
    );

    it('renders the wallet details correctly in real:', () => {
        render(<WalletAppCard {...mocked_props} />, { wrapper });
        expect(screen.getByText(/Real/i)).toBeInTheDocument();
        expect(screen.getByText(/USD Wallet/i)).toBeInTheDocument();
        expect(screen.getByText(/0.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/Success/i)).toBeInTheDocument();
    });

    it('renders the wallet details correctly in demo:', () => {
        mocked_props.wallet.is_demo = true;
        mocked_props.wallet.balance = '10,000 USD';
        render(<WalletAppCard {...mocked_props} />, { wrapper });
        expect(screen.getByText(/Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000 USD/i)).toBeInTheDocument();
    });
});
