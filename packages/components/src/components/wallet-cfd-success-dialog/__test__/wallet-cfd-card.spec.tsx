import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCFDCard from '../wallet-cfd-card';

let mocked_props = {
    wallet: {
        account_title: '',
        app_icon: '',
        currency: '',
        gradient_header_class: '',
        icon: '',
        is_demo: false,
        type: '',
    },
};

describe('render <WalletCFDCard />', () => {
    beforeEach(() => {
        mocked_props = {
            wallet: {
                account_title: 'Success',
                app_icon: 'app_icon',
                currency: 'USD',
                gradient_header_class: 'gradient_class',
                icon: 'usd_icon',
                is_demo: false,
                type: 'synthetic',
            },
        };
    });

    it('renders the wallet details correctly in real:', () => {
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Real/i)).toBeInTheDocument();
        expect(screen.getByText(/USD Wallet/i)).toBeInTheDocument();
        expect(screen.getByText(/0/i)).toBeInTheDocument();
        expect(screen.getByText(/Success/i)).toBeInTheDocument();
    });

    it('renders the wallet details correctly in demo:', () => {
        mocked_props.wallet.is_demo = true;
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000/i)).toBeInTheDocument();
    });
});
