import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CashierWalletModalHeader from '../cashier-wallet-modal-header';

describe('CashierWalletModalHeader', () => {
    let mocked_props: React.ComponentProps<typeof CashierWalletModalHeader>;

    beforeEach(() => {
        mocked_props = {
            balance: '999',
            closeModal: jest.fn(),
            currency: 'USD',
            is_dark: false,
            is_demo: true,
            is_mobile: false,
            show_wallet_name: true,
        };
    });

    it('Should render header with proper title, balance, badge and icons', () => {
        render(<CashierWalletModalHeader {...mocked_props} />);

        expect(screen.getByText('Demo USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('999.00 USD')).toBeInTheDocument();
        expect(screen.getByTestId('dt_currency_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_close_icon')).toBeInTheDocument();
    });

    it('Should trigger onClose callback when the user clicked on the cross close button', () => {
        render(<CashierWalletModalHeader {...mocked_props} />);

        const el_close_btn = screen.getByTestId('dt_close_icon');
        userEvent.click(el_close_btn);

        expect(mocked_props.closeModal).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't show wallet name, badge and currency icon when show_wallet_name is false", () => {
        render(<CashierWalletModalHeader {...mocked_props} show_wallet_name={false} />);

        expect(screen.queryByText('Demo USD Wallet')).not.toBeInTheDocument();
        expect(screen.queryByText('Demo')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_currency_icon')).not.toBeInTheDocument();
    });
});
