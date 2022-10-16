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

describe('ChangePasswordConfirmation', () => {
    const mock_props = {
        confirm_label: 'Confirm',
        platform: 'mt5',
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
    };

    it('should render cfd-change-password-confirmation component', () => {
        render(<ChangePasswordConfirmation {...mock_props} />);
        expect(screen.getByTestId('dt_cfd_change_password_form')).toBeInTheDocument();
    });

    it('should show icon and buttons', () => {
        render(<ChangePasswordConfirmation {...mock_props} />);

        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should cancel when cancel button is clicked', async () => {
        render(<ChangePasswordConfirmation {...mock_props} />);

        const el_cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        expect(el_cancel_btn).toBeInTheDocument();

        fireEvent.click(el_cancel_btn);
        await waitFor(() => {
            expect(mock_props.onCancel).toHaveBeenCalledTimes(1);
        });
    });

    it('should close when create button is clicked', async () => {
        render(<ChangePasswordConfirmation {...mock_props} />);

        const el_create_btn = screen.getByRole('button', { name: 'Confirm' });
        expect(el_create_btn).toBeInTheDocument();
        fireEvent.click(el_create_btn);
        await waitFor(() => {
            expect(mock_props.onConfirm).toHaveBeenCalledTimes(1);
        });
    });

    it('check whether the text is according to the platform', () => {
        render(<ChangePasswordConfirmation {...mock_props} />);

        expect(screen.getByText(/Confirm to change your Deriv MT5 password/i)).toBeInTheDocument();
        expect(
            screen.getByText(/This will change the password to all of your Deriv MT5 accounts/i)
        ).toBeInTheDocument();
    });
});
