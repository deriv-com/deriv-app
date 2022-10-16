import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoTransactionsCancelModal from '../crypto-transactions-cancel-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoTransactionsCancelModal />', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should show "Are you sure you want to cancel this transaction" and "Cancel transaction" messages, "Yes" and "No" buttons', () => {
        render(<CryptoTransactionsCancelModal is_cancel_modal_visible />);

        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Yes" button', () => {
        const cancelCryptoTransaction = jest.fn();

        render(
            <CryptoTransactionsCancelModal is_cancel_modal_visible cancelCryptoTransaction={cancelCryptoTransaction} />
        );
        const yes_btn = screen.getByText('Yes');
        fireEvent.click(yes_btn);

        expect(cancelCryptoTransaction).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the user clicks "No" button', () => {
        const hideCryptoTransactionsCancelModal = jest.fn();

        render(
            <CryptoTransactionsCancelModal
                is_cancel_modal_visible
                hideCryptoTransactionsCancelModal={hideCryptoTransactionsCancelModal}
            />
        );
        const no_btn = screen.getByText('No');
        fireEvent.click(no_btn);

        expect(hideCryptoTransactionsCancelModal).toHaveBeenCalledTimes(1);
    });
});
