import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useSettings: jest.fn(() => ({
        refetch: jest.fn(() => Promise.resolve()),
    })),
}));

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;
    const mock_store = mockStore({});

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mockSetShouldShowPhoneNumberVerifiedModal = jest.fn();

    const renderModal = () => {
        render(
            <StoreProvider store={mock_store}>
                <MemoryRouter>
                    <PhoneNumberVerifiedModal
                        should_show_phone_number_verified_modal
                        setShouldShowPhoneNumberVerifiedModal={mockSetShouldShowPhoneNumberVerifiedModal}
                    />
                </MemoryRouter>
            </StoreProvider>
        );
    };

    it('it should render PhoneNumberVerifiedModal', () => {
        renderModal();
        expect(screen.getByText(/Success/)).toBeInTheDocument();
        expect(screen.getByText(/Your phone number is verified./)).toBeInTheDocument();
    });

    it('it should close PhoneNumberVerifiedModal and navigate to PersonalDetails section when done is clicked', async () => {
        renderModal();
        const doneButton = screen.getByRole('button', { name: /OK/ });
        await userEvent.click(doneButton);
        expect(mockSetShouldShowPhoneNumberVerifiedModal).toHaveBeenCalledTimes(1);
    });
});
