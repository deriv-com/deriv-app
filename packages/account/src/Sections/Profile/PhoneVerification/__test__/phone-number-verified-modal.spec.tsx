import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
}));

const mockRefetch = jest.fn(() => Promise.resolve());

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useSettings: jest.fn(() => ({
        refetch: mockRefetch,
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

    const renderModal = () => {
        render(
            <StoreProvider store={mock_store}>
                <MemoryRouter>
                    <PhoneNumberVerifiedModal should_show_phone_number_verified_modal />
                </MemoryRouter>
            </StoreProvider>
        );
    };

    it('it should render PhoneNumberVerifiedModal', () => {
        renderModal();
        expect(screen.getByText(/Success/)).toBeInTheDocument();
        expect(screen.getByText(/Your phone number is verified./)).toBeInTheDocument();
    });

    it('it should refetch GetSettings when done is clicked', async () => {
        renderModal();
        const doneButton = screen.getByRole('button', { name: /OK/ });
        await userEvent.click(doneButton);
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
});
