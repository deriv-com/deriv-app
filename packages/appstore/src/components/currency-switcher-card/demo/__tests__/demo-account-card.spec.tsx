import React from 'react';
import DemoAccountCard from '../demo-account-card';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider, useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'wallet_migration'>>;

describe('DemoAccountCard', () => {
    it('should render correctly', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        VRTC123123: {
                            landing_company_short: 'svg',
                        },
                    },
                },
            },
            traders_hub: {
                selected_account_type: 'demo',
            },
            client: {
                accounts: {
                    CR1231123: {
                        balance: 10000,
                        currency: 'USD',
                    },
                },
                loginid: 'CR1231123',
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<DemoAccountCard />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render correctly with the correct balance and text', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        VRTC123123: {
                            landing_company_short: 'svg',
                        },
                    },
                },
            },
            traders_hub: {
                selected_account_type: 'demo',
            },
            client: {
                accounts: {
                    VRTC123123: {
                        balance: 10000,
                        currency: 'USD',
                        is_virtual: 1,
                    },
                },
                loginid: 'VRTC123123',
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<DemoAccountCard />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('demo')).toBeInTheDocument();
        expect(screen.getByText('10,000.00')).toBeInTheDocument();
    });

    it('should render the reset balance button when the balance is not 10,000', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        VRTC123123: {
                            landing_company_short: 'svg',
                        },
                    },
                },
            },
            traders_hub: {
                selected_account_type: 'demo',
            },
            client: {
                accounts: {
                    VRTC123123: {
                        balance: 9000,
                        currency: 'USD',
                        is_virtual: 1,
                    },
                },
                loginid: 'VRTC123123',
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<DemoAccountCard />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('demo')).toBeInTheDocument();
        expect(screen.getByText('9,000.00')).toBeInTheDocument();
        expect(screen.getByText('Reset Balance')).toBeInTheDocument();
    });
});
