import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCFDSuccessDialog from '../wallet-cfd-success-dialog';

const mocked_wallet = {
    currency: 'USD',
    gradient_header_class: 'gradient_class',
    icon: 'icon_usd',
    is_demo: true,
    type: 'derived',
};

const mocked_props = {
    header: 'CFD Wallet Modal Header',
    message: 'CFD Wallet Modal Message',
    is_open: true,
    onSubmit: jest.fn(),
    toggleModal: jest.fn(),
    wallet: mocked_wallet,
};

describe('render <WalletCFDSuccessDialog />', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    it('renders the components text properly:', () => {
        render(<WalletCFDSuccessDialog {...mocked_props} />);

        expect(screen.getByText('CFD Wallet Modal Header')).toBeInTheDocument();
        expect(screen.getByText('CFD Wallet Modal Message')).toBeInTheDocument();
    });
});
