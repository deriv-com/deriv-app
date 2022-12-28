import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderCard from '../on-ramp-provider-card';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<OnRampProviderCard />', () => {
    const props = {
        is_dark_mode_on: false,
        is_mobile: false,
        provider: {
            name: 'Banxa',
            icon: {
                dark: 'IcCashierBanxaDark',
                light: 'IcCashierBanxaLight',
            },
            getDescription: jest.fn(
                () =>
                    'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
            ),
            getPaymentIcons: jest.fn(() => [{ dark: 'IcCashierFlexepinDark', light: 'IcCashierFlexepinLight' }]),
        },
        setSelectedProvider: jest.fn(),
    };

    it('should show proper messages and button', () => {
        render(<OnRampProviderCard {...props} />);

        expect(screen.getByText('Banxa')).toBeInTheDocument();
        expect(
            screen.getByText(
                'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    });

    it('should show proper icons in dark_mode', () => {
        render(<OnRampProviderCard {...props} is_dark_mode_on />);

        expect(screen.getByTestId('dti_provider_icon_dark')).toBeInTheDocument();
        expect(screen.getByTestId('dti_payment_icon_dark')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when "Select" button is clicked', () => {
        render(<OnRampProviderCard {...props} />);

        const btn = screen.getByRole('button', { name: 'Select' });
        fireEvent.click(btn);

        expect(props.setSelectedProvider).toHaveBeenCalledTimes(1);
    });
});
