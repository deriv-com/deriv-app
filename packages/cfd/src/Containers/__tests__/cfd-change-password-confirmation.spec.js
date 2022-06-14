import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordConfirmation from '../cfd-change-password-confirmation';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});

it('should render cfd-change-password-confirmation component', () => {
    render(<ChangePasswordConfirmation />);
    expect(screen.getByTestId('dt_cfd_change_password_form')).toBeInTheDocument();
});

it('should show icon and buttons', () => {
    render(<ChangePasswordConfirmation />);

    expect(screen.getByText('mockedIcon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
});

it('should cancel when cancel button is clicked', () => {
    render(<ChangePasswordConfirmation platform='mt5' />);

    const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(el_cancel_btn);

    waitFor(() => {
        expect(
            screen.queryByText(/This will change the password to all of your DMT5 accounts/i)
        ).not.toBeInTheDocument();
    });
});

it('should close when create button is clicked', () => {
    render(<ChangePasswordConfirmation platform='mt5' />);

    const el_create_btn = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(el_create_btn);

    waitFor(() => {
        expect(
            screen.queryByText(/This will change the password to all of your DMT5 accounts/i)
        ).not.toBeInTheDocument();
    });
});

it('check whether the text is according to the platform', () => {
    render(<ChangePasswordConfirmation platform='mt5' />);

    expect(screen.getByText(/Confirm to change your DMT5 password/i)).toBeInTheDocument();
    expect(screen.getByText(/This will change the password to all of your DMT5 accounts/i)).toBeInTheDocument();
});
