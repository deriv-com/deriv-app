import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('it should render PhoneNumberVerifiedModal', () => {
        (React.useState as jest.Mock).mockReturnValue([true, jest.fn()]);
        render(<PhoneNumberVerifiedModal />);
        expect(screen.getByText(/Verification successful/)).toBeInTheDocument();
        expect(screen.getByText(/That's it! Your number is verified./)).toBeInTheDocument();
    });

    it('it should render setShouldShowPhoneNumberVerifiedModal when done is clicked', () => {
        const setState = jest.fn();
        (React.useState as jest.Mock).mockReturnValue([true, setState]);
        render(<PhoneNumberVerifiedModal />);
        const doneButton = screen.getByRole('button', { name: /Done/ });
        userEvent.click(doneButton);
        expect(setState).toBeCalled();
    });
});
