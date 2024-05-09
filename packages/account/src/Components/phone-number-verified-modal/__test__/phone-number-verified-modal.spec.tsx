import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;
    const mock_store = mockStore({
        ui: {
            should_show_phone_number_verified_modal: true,
            setShouldShowPhoneNumberVerifiedModal: jest.fn(),
        },
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('it should render PhoneNumberVerifiedModal', () => {
        render(
            <StoreProvider store={mock_store}>
                <PhoneNumberVerifiedModal />
            </StoreProvider>
        );
        expect(screen.getByText(/Verification successful/)).toBeInTheDocument();
        expect(screen.getByText(/That's it! Your number is verified./)).toBeInTheDocument();
    });

    it('it should render setShouldShowPhoneNumberVerifiedModal when done is clicked', () => {
        render(
            <StoreProvider store={mock_store}>
                <PhoneNumberVerifiedModal />
            </StoreProvider>
        );
        const doneButton = screen.getByRole('button', { name: /Done/ });
        userEvent.click(doneButton);
        expect(mock_store.ui.setShouldShowPhoneNumberVerifiedModal).toBeCalled();
    });
});
