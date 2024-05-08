import { render, screen } from '@testing-library/react';
import React from 'react';
import ConfirmPhoneNumber from '../confirm-phone-number';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useGetPhoneNumberOTP } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPhoneNumberOTP: jest.fn(() => ({
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
    })),
}));

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
    it('should call requestOnWhatsApp when Whatsapp button is clicked', () => {
        const mockWhatsappButtonClick = jest.fn();

        (useGetPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnWhatsApp: mockWhatsappButtonClick,
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber />
            </StoreProvider>
        );
        const whatsapp_btn = screen.getByRole('button', { name: 'Get code via WhatsApp' });
        userEvent.click(whatsapp_btn);
        expect(mockWhatsappButtonClick).toHaveBeenCalled();
    });
    it('should call requestOnSMS when SMS button is clicked', () => {
        const mockSmsButtonClick = jest.fn();

        (useGetPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnSMS: mockSmsButtonClick,
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber />
            </StoreProvider>
        );
        const sms_btn = screen.getByRole('button', { name: 'Get code via SMS' });
        userEvent.click(sms_btn);
        expect(mockSmsButtonClick).toHaveBeenCalled();
    });
});
