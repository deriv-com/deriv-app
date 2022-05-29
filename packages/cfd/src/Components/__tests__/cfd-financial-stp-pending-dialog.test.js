import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CFDFinancialStpPendingDialog from '../cfd-financial-stp-pending-dialog';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

describe('<CFDFinancialStpPendingDialog />', () => {
    const props = {
        enableApp: jest.fn(),
        disableApp: jest.fn(),
        toggleModal: jest.fn(),
        is_cfd_pending_dialog_open: true,
        is_fully_authenticated: false,
    };

    it('should show proper messages when the component is fully authenticated', () => {
        render(<CFDFinancialStpPendingDialog {...props} is_fully_authenticated />);
        expect(
            screen.getByText('Your MT5 Financial STP account is almost ready, please set your password now.')
        ).toBeInTheDocument();
    });

    it('should show proper messages when component is not fully authenticated', () => {
        render(<CFDFinancialStpPendingDialog {...props} />);
        expect(
            screen.getByText(
                'We’ll process your documents within 1-3 days. Once they are verified, we’ll notify you via email.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Thanks for submitting your documents!')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks on "OK"', () => {
        render(<CFDFinancialStpPendingDialog {...props} />);
        const ok_button = screen.getByRole('button', { name: 'OK' });

        expect(ok_button).toBeInTheDocument();

        fireEvent.click(ok_button);
        expect(props.toggleModal).toHaveBeenCalledTimes(1);
    });
});
