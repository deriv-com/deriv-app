import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletModalHeader from '../wallet-modal-header';

describe('WalletModalHeader', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalHeader>;

    beforeEach(() => {
        mocked_props = {
            balance: 999,
            closeModal: jest.fn(),
            currency: 'USD',
            is_dark: false,
            is_demo: true,
            is_mobile: false,
            is_wallet_name_visible: true,
            shortcode: 'SVG',
        };
    });

    it('Should render header with proper title, balance, badge and icons', () => {
        render(<WalletModalHeader {...mocked_props} />);

        expect(screen.getByText('Demo USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('999.00 USD')).toBeInTheDocument();
        expect(screen.getByTestId('dt_currency_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_close_icon')).toBeInTheDocument();
    });

    it('Should trigger onClose callback when the user clicked on the cross close button', () => {
        render(<WalletModalHeader {...mocked_props} />);

        const el_close_btn = screen.getByTestId('dt_close_icon');
        userEvent.click(el_close_btn);

        expect(mocked_props.closeModal).toHaveBeenCalledTimes(1);
    });
});
