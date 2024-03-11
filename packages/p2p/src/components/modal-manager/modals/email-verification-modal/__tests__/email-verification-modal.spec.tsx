import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import EmailVerificationModal from '../email-verification-modal';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const el_modal = document.createElement('div');

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
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

        expect(screen.getByText('Has the buyer paid you?')).toBeInTheDocument();
        expect(
            screen.queryByText(
                /Releasing funds before receiving payment may result in losses. Check your email and follow the instructions/
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('within 10 minutes', { selector: 'strong' })).toBeInTheDocument();
        expect(screen.queryByText(/to release the funds./)).toBeInTheDocument();
    });

    it('should be able to click on I didn’t receive the email and setShouldShowReasonsIfNoEmail should be passing true', () => {
        const setShouldShowReasonsIfNoEmailMock = jest.spyOn(React, 'useState');
        (setShouldShowReasonsIfNoEmailMock as jest.Mock).mockImplementation(initial_value => [
            initial_value,
            jest.fn(),
        ]);

        render(<EmailVerificationModal />);

        const didntReceiveEmailText = screen.getByText('I didn’t receive the email');

        userEvent.click(didntReceiveEmailText);

        expect(setShouldShowReasonsIfNoEmailMock).toHaveBeenCalled();
    });

    it('should call hideModal, confirmOrderRequest when clicking on Resend Email button', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));

        render(<EmailVerificationModal />);

        const resendEmail = screen.getByRole('button', { name: 'Resend email' });

        userEvent.click(resendEmail);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_store.order_store.confirmOrderRequest).toHaveBeenCalledWith(
            mock_store.order_store.order_information.id
        );
    });
});
