import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoTransactionsStatusModal from '../crypto-transactions-status-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoTransactionsStatusModal />', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should show proper messages and "OK" button', () => {
        render(
            <CryptoTransactionsStatusModal
                is_status_modal_visible
                selected_crypto_status={'Crypto transaction status'}
                selected_crypto_status_description={'Crypto transaction status description'}
            />
        );

        expect(screen.getByText('Crypto transaction status')).toBeInTheDocument();
        expect(screen.getByText('Crypto transaction status description')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "OK" button', () => {
        const hideCryptoTransactionsStatusModal = jest.fn();

        render(
            <CryptoTransactionsStatusModal
                is_status_modal_visible
                hideCryptoTransactionsStatusModal={hideCryptoTransactionsStatusModal}
            />
        );
        const ok_btn = screen.getByText('OK');
        fireEvent.click(ok_btn);

        expect(hideCryptoTransactionsStatusModal).toHaveBeenCalledTimes(1);
    });
});
