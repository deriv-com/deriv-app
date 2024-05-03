import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CancelPhoneVerificationModal from '../cancel-phone-verification-modal';

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

    const buttons = [/Go back/, /Yes, cancel/];

    it('it should render CancelPhoneVerificationModal', () => {
        render(
            <CancelPhoneVerificationModal
                should_show_cancel_verification_modal
                setShouldShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        expect(screen.getByText(/Cancel phone number verification?/)).toBeInTheDocument();
        expect(screen.getByText(/All details entered will be lost./)).toBeInTheDocument();
        buttons.forEach(value => {
            expect(screen.getByRole('button', { name: value })).toBeInTheDocument();
        });
    });

    it('it should render only mockSetShowCancelModal when Go back is clicked', () => {
        render(
            <CancelPhoneVerificationModal
                should_show_cancel_verification_modal
                setShouldShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        const cancelButton = screen.getByRole('button', { name: buttons[0] });
        userEvent.click(cancelButton);
        expect(mockSetShowCancelModal).toBeCalled();
        expect(mock_back_router).not.toBeCalled();
    });

    it('it should render mockSetShowCancelModal and mock_back_router when Yes, cancel is clicked', () => {
        render(
            <CancelPhoneVerificationModal
                should_show_cancel_verification_modal
                setShouldShowCancelVerificationModal={mockSetShowCancelModal}
            />
        );
        const cancelButton = screen.getByRole('button', { name: buttons[1] });
        userEvent.click(cancelButton);
        expect(mockSetShowCancelModal).toBeCalled();
        expect(mock_back_router).toBeCalled();
    });
});
