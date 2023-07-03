import React from 'react';
import { screen, render } from '@testing-library/react';
import EmailVerificationModal from '../email-verification-modal';
import userEvent from '@testing-library/user-event';

let mock_store;

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
}));

describe('EmailVerificationModal />', () => {
    beforeEach(() => {
        mock_store = {
            order_store: {
                confirmOrderRequest: jest.fn(),
                order_information: {
                    id: 1,
                },
            },
        };
    });
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render EmailVerificationModal', () => {
        render(<EmailVerificationModal />);

        expect(screen.getByText('Check your email')).toBeInTheDocument();
        expect(
            screen.getByText('Hit the link in the email we sent you to authorise this transaction.')
        ).toBeInTheDocument();
        expect(screen.getByText('The link will expire in 10 minutes.')).toBeInTheDocument();
    });

    it('should be able to click on didn`t receive email and setShouldShowReasonsIfNoEmail should be passing true', () => {
        const setShouldShowReasonsIfNoEmailMock = jest.spyOn(React, 'useState');
        setShouldShowReasonsIfNoEmailMock.mockImplementation(initialValue => [initialValue, jest.fn()]);

        render(<EmailVerificationModal />);

        const didntReceiveEmailText = screen.getByText("Didn't receive the email?");

        userEvent.click(didntReceiveEmailText);

        expect(setShouldShowReasonsIfNoEmailMock).toHaveBeenCalled();
    });

    // TODO: Add other checks for hideModal and setShouldShowReasonsIfNoEmail to be called when refactoring this component
    it('should call confirmOrderRequest when clicking on Resend Email button', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

        render(<EmailVerificationModal />);

        const resendEmail = screen.getByRole('button', { name: 'Resend email' });

        userEvent.click(resendEmail);

        expect(mock_store.order_store.confirmOrderRequest).toHaveBeenCalledWith(
            mock_store.order_store.order_information.id
        );
    });
});
