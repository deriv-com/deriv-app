import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePasswordConfirmation from '../cfd-change-password-confirmation';

it('should render cfd-change-password-confirmation component', () => {
    render(<ChangePasswordConfirmation />);
    expect(screen.getByTestId('cfd-change-password-modal')).toBeInTheDocument();
});

it('should show icon and buttons', () => {
    render(<ChangePasswordConfirmation />);

    const icon = screen.getByTestId('cfd-change-password-confirmation-icon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
});

it('should cancel when cancel button is clicked', () => {
    render(<ChangePasswordConfirmation />);

    const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
    const el_password_container = screen.queryByTestId('cfd-change-password-container');
    fireEvent.click(el_cancel_btn);
    expect(el_password_container).not.toBeInTheDocument();
});

it('should close when create button is clicked', () => {
    render(<ChangePasswordConfirmation />);

    const el_create_btn = screen.getByRole('button', { name: 'Create' });
    const el_password_container = screen.queryByTestId('cfd-change-password-container');
    fireEvent.click(el_create_btn);
    expect(el_password_container).not.toBeInTheDocument();
});

it('check whether the text is according to the platform', () => {
    render(<ChangePasswordConfirmation platform='mt5' />);

    expect(screen.getByText(/This will change the password to all of your DMT5 accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/This will change the password to all of your DMT5 accounts/i)).toBeInTheDocument();
});
