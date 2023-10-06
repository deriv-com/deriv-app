import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCFDCard from '../wallet-cfd-card';

describe('render <WalletCFDCard />', () => {
    const mocked_props = {
        wallet: {
            account_title: 'Success',
            app_icon: 'app_icon',
            currency: 'USD Wallet',
            gradient_header_class: 'gradient_class',
            icon: 'usd_icon',
            is_demo: false,
            wallet_label: 'Real',
            balance: '0.0',
        },
    };

    it('renders the wallet details correctly in real:', () => {
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Real/i)).toBeInTheDocument();
        expect(screen.getByText(/USD Wallet/i)).toBeInTheDocument();
        expect(screen.getByText(/0.0/i)).toBeInTheDocument();
        expect(screen.getByText(/Success/i)).toBeInTheDocument();
    });

    it('renders the wallet details correctly in demo:', () => {
        mocked_props.wallet.is_demo = true;
        mocked_props.wallet.wallet_label = 'Demo';
        mocked_props.wallet.balance = '10,000';
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000/i)).toBeInTheDocument();
    });
});
