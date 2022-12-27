import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderCard from '../on-ramp-provider-card';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from 'Types';

describe('<OnRampProviderCard />', () => {
    const provider = {
        name: 'Changelly',
        icon: {
            dark: 'IcCashierChangellyDark',
            light: 'IcCashierChangellyLight',
        },
        getDescription: jest.fn(
            () =>
                'Your simple access to crypto. Fast and secure way to exchange and purchase cryptocurrencies. 24/7 live chat support.'
        ),
        getPaymentIcons: jest.fn(() => [{ dark: 'IcCashierFpsDark', light: 'IcCashierFpsLight' }]),
    };

    it('should show proper messages and button', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: false,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Changelly')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your simple access to crypto. Fast and secure way to exchange and purchase cryptocurrencies. 24/7 live chat support.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    });

    it('should show proper icons in dark_mode', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByTestId('dti_provider_icon_dark')).toBeInTheDocument();
        expect(screen.getByTestId('dti_payment_icon_dark')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when "Select" button is clicked', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: false,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const btn = screen.getByRole('button', { name: 'Select' });
        fireEvent.click(btn);

        expect(mockRootStore.modules!.cashier!.onramp.setSelectedProvider).toHaveBeenCalledTimes(1);
    });
});
