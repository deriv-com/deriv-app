import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CancelPhoneVerificationModal from '../cancel-phone-verification-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';

const mock_push = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mock_push,
        block: jest.fn(callback => {
            callback({ pathname: routes.personal_details });
            return jest.fn();
        }),
    }),
    useLocation: () => ({
        pathname: '/phone-verification',
    }),
}));

describe('CancelPhoneVerificationModal', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_store = mockStore({
        ui: {
            should_show_cancel_verification_modal: {
                show_modal: true,
            },
            setShouldShowCancelVerificationModal: mockSetShowCancelModal,
        },
    });

    const buttons = [/Go back/, /Yes, cancel/];

    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <CancelPhoneVerificationModal />
            </StoreProvider>
        );
    };

    it('it should render CancelPhoneVerificationModal', () => {
        renderComponent();
        buttons.forEach(value => {
            expect(screen.getByRole('button', { name: value })).toBeInTheDocument();
        });
        expect(screen.getByText(/Cancel phone number verification?/)).toBeInTheDocument();
        expect(screen.getByText(/All details entered will be lost./)).toBeInTheDocument();
    });

    it('it should render only mockSetShowCancelModal when Go back is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[0] });
        userEvent.click(cancelButton);
        expect(mock_push).not.toBeCalled();
    });

    it('it should render mockSetShowCancelModal and mock_back_router when Yes, cancel is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[1] });
        userEvent.click(cancelButton);
        expect(mock_push).toBeCalledWith(routes.personal_details);
    });
});
