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
            name: 'Changelly',
            icon: {
                dark: 'IcCashierChangellyDark',
                light: 'IcCashierChangellyLight',
            },
            getDescription: jest.fn(
                () =>
                    'Your simple access to crypto. Fast and secure way to exchange and purchase cryptocurrencies. 24/7 live chat support.'
            ),
            getPaymentIcons: jest.fn(() => [
                { dark: 'IcCashierFpsDark', light: 'IcCashierFpsLight' },
                { dark: 'IcCashierAliPayDark', light: 'IcCashierAliPayLight' },
                { dark: 'IcCashierGoPayDark', light: 'IcCashierGoPayLight' },
            ]),
        },
        setSelectedProvider: jest.fn(),
    };

    const getIconNames = container => {
        const icons = container.querySelectorAll('.dc-icon');
        let icon_names = [];
        icons.forEach(icon => {
            const icon_path = icon.firstChild.getAttribute('xlink:href');
            icon_names.push(icon_path.slice(icon_path.indexOf('#') + 1));
        });
        return icon_names;
    };

    it('should show proper messages and button', () => {
        render(<OnRampProviderCard {...props} />);

        expect(screen.getByText('Changelly')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your simple access to crypto. Fast and secure way to exchange and purchase cryptocurrencies. 24/7 live chat support.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    });

    it('should show proper icons in dark_mode', () => {
        const { container } = render(<OnRampProviderCard {...props} is_dark_mode_on />);

        expect(getIconNames(container)).toContain('ic-cashier-changelly-dark');
        expect(getIconNames(container)).toContain('ic-cashier-fps-dark');
        expect(getIconNames(container)).toContain('ic-cashier-ali-pay-dark');
        expect(getIconNames(container)).toContain('ic-cashier-go-pay-dark');
    });

    it('should trigger onClick callback, when "Select" button is clicked', () => {
        render(<OnRampProviderCard {...props} />);

        const btn = screen.getByRole('button', { name: 'Select' });
        fireEvent.click(btn);

        expect(props.setSelectedProvider).toHaveBeenCalledTimes(1);
    });
});
