import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import { MemoryRouter } from 'react-router';
import { routes } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
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

    const renderModal = () => {
        render(
            <MemoryRouter>
                <StoreProvider store={mock_store}>
                    <PhoneNumberVerifiedModal />
                </StoreProvider>
            </MemoryRouter>
        );
    };

    it('it should render PhoneNumberVerifiedModal', () => {
        const spy = jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);
        renderModal();
        expect(screen.getByText(/Verification successful/)).toBeInTheDocument();
        expect(screen.getByText(/That's it! Your number is verified./)).toBeInTheDocument();
        spy.mockRestore();
    });

    it('it should close PhoneNumberVerifiedModal and navigate to PersonalDetails section when done is clicked', () => {
        const setState = jest.fn();
        const spy = jest.spyOn(React, 'useState').mockImplementation(() => [true, setState]);
        renderModal();
        const doneButton = screen.getByRole('button', { name: /Done/ });
        userEvent.click(doneButton);
        expect(setState).toBeCalled();
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.personal_details);
        spy.mockRestore();
    });
});
