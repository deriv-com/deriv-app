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
        balance: '',
        account_title: '',
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
                balance: '0',
                account_title: 'Successfully create a MT5 account',
            },
        };
    });

    it('renders the wallet details correctly in real:', () => {
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Real/i)).toBeInTheDocument();
        expect(screen.getByText(/Successfully create a MT5 account/i)).toBeInTheDocument();
        expect(screen.getByText(/0/i)).toBeInTheDocument();
    });

    it('renders the wallet details correctly in demo:', () => {
        mocked_props.wallet.is_demo = true;
        mocked_props.wallet.balance = '10000';
        render(<WalletCFDCard {...mocked_props} />);
        expect(screen.getByText(/Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/10000/i)).toBeInTheDocument();
    });
});
