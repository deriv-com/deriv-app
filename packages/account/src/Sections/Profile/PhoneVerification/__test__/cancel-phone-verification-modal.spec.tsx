import React from 'react';
import CancelPhoneVerificationModal from '../cancel-phone-verification-modal';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mock_back_router = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        goBack: mock_back_router,
    }),
}));

describe('CancelPhoneVerificationModal', () => {
    let modal_root_el: HTMLElement;
    const mockSetShowCancelModal = jest.fn();

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('it should render CancelPhoneVerificationModal', () => {
        render(
            <CancelPhoneVerificationModal
                show_cancel_verification_modal
                setShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        expect(screen.getByText(/Cancel phone number verification?/)).toBeInTheDocument();
        expect(screen.getByText(/All details entered will be lost./)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Go back/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Yes, cancel/ })).toBeInTheDocument();
    });

    it('it should render mockSetShowCancelModal and mock_back_router when Yes, cancel is clicked', () => {
        render(
            <CancelPhoneVerificationModal
                show_cancel_verification_modal
                setShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        const cancelButton = screen.getByRole('button', { name: /Yes, cancel/ });
        userEvent.click(cancelButton);
        expect(mockSetShowCancelModal).toBeCalled();
        expect(mock_back_router).toBeCalled();
    });

    it('it should render only mockSetShowCancelModal when Go back is clicked', () => {
        render(
            <CancelPhoneVerificationModal
                show_cancel_verification_modal
                setShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        const cancelButton = screen.getByRole('button', { name: /Go back/ });
        userEvent.click(cancelButton);
        expect(mockSetShowCancelModal).toBeCalled();
        expect(mock_back_router).not.toBeCalled();
    });
});
