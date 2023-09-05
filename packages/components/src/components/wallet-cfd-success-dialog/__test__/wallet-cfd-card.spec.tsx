import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCFDCard from '../wallet-cfd-card';

let mocked_props = {
    wallet: {
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
    });

    it('renders the wallet details correctly in demo:', () => {
        mocked_props.wallet.is_demo = true;
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000/i)).toBeInTheDocument();
    });

    it('return correct app title based on types (Derived):', () => {
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/MT5 Derived/i)).toBeInTheDocument();
        expect(screen.queryByText(/MT5 Financial/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/MT5 SwapFree/i)).not.toBeInTheDocument();
    });

    it('return correct app title based on types (Financial):', () => {
        mocked_props.wallet.type = 'financial';
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/MT5 Financial/i)).toBeInTheDocument();
        expect(screen.queryByText(/MT5 Derived/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/MT5 SwapFree/i)).not.toBeInTheDocument();
    });

    it('return correct app title based on types (All):', () => {
        mocked_props.wallet.type = 'all';
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/MT5 SwapFree/i)).toBeInTheDocument();
        expect(screen.queryByText(/MT5 Derived/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/MT5 Financial/i)).not.toBeInTheDocument();
    });
});
