import { render, screen } from '@testing-library/react';
import React from 'react';
import ConfirmPhoneNumber from '../confirm-phone-number';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        client: {
            account_settings: {
                phone: '+0123456789',
            },
        },
    });

    it('should render ConfirmPhoneNumber', () => {
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('+0123456789');
        expect(screen.getByRole('button', { name: 'Get code via SMS' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get code via WhatsApp' })).toBeInTheDocument();
    });
});
