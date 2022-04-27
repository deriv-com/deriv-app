import React from 'react';
import { useStores } from 'Stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NicknameForm from '../nickname-form.jsx';

const mock_general_store = {
    onNicknamePopupClose: jest.fn(),
    createAdvertiser: jest.fn(),
    validatePopup: jest.fn(),
    setNicknameError: jest.fn(),
    nickname_error: false,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { ...mock_general_store },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('<NicknameForm/>', () => {
    it('closes the popup if close icon is clicked', () => {
        const { general_store } = useStores();
        render(<NicknameForm />);
        fireEvent.click(screen.getByTestId('icon_close'));

        expect(general_store.onNicknamePopupClose).toHaveBeenCalled();
    });

    it('should disable only the Subit button when empty form is present', () => {
        render(<NicknameForm />);

        expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });

    it('shoucl submit data when valid data is present in the form', async () => {
        const { general_store } = useStores();
        render(<NicknameForm />);
        fireEvent.input(screen.getByLabelText(/nickname/i), { target: { value: 'P2P Test' } });
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

        await waitFor(() => expect(general_store.createAdvertiser).toHaveBeenCalledWith('P2P Test'));
    });

    it('should close popup if Cancel button is clicked', () => {
        const { general_store } = useStores();
        render(<NicknameForm />);
        fireEvent.input(screen.getByLabelText(/nickname/i), { target: { value: 'P2P Test' } });
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

        expect(general_store.onNicknamePopupClose).toHaveBeenCalled();
    });
});
