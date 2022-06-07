import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CFDChangePasswordConfirmation from '../cfd-change-password-confirmation';

it('should render cfd-change-password-confirmation component', () => {
    render(<CFDChangePasswordConfirmation />);
    expect(screen.getByTestId('cfd-change-password-modal')).toBeInTheDocument();
});

it('should show icon and buttons', () => {
    render(<CFDChangePasswordConfirmation />);

    const icon = screen.getByTestId('cfd-change-password-confirmation-icon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
});

it('should cancel when click cancel button is clicked', () => {
    render(<CFDChangePasswordConfirmation />);

    const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
    const el_password_container = screen.queryByTestId('cfd-change-password-container');
    fireEvent.click(el_cancel_btn);
    expect(el_password_container).not.toBeInTheDocument();
});

it('should close when click create button is clicked', () => {
    render(<CFDChangePasswordConfirmation />);

    const el_create_btn = screen.getByRole('button', { name: 'Create' });
    const el_password_container = screen.queryByTestId('cfd-change-password-container');
    fireEvent.click(el_create_btn);
    expect(el_password_container).not.toBeInTheDocument();
});
