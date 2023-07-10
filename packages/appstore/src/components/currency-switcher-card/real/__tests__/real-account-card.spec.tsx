import React from 'react';
import RealAccountCard from '../real-account-card';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { APIProvider, useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'wallet_migration'>>;

describe('RealAccountCard', () => {
    it('should render the component', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealAccountCard />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render the component with the correct balance and currency as USD', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR1231123: {
                        balance: 1000,
                        currency: 'USD',
                    },
                },
                loginid: 'CR1231123',
            },
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealAccountCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should render the component with the correct balance and currency as EUR', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR1231123: {
                        balance: 20120,
                        currency: 'EUR',
                    },
                },
                loginid: 'CR1231123',
            },
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealAccountCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('20,120.00')).toBeInTheDocument();
        expect(screen.getByText('EUR')).toBeInTheDocument();
    });

    it('should redirect the user to cashier_deposit page after clicking deposit', async () => {
        const history = createMemoryHistory();
        const mock = mockStore({
            client: {
                accounts: {
                    CR1231123: {
                        balance: 20120,
                        currency: 'EUR',
                    },
                },
                loginid: 'CR1231123',
            },
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <Router history={history}>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </Router>
            </APIProvider>
        );

        const { container } = render(<RealAccountCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Deposit'));
        expect(history.location.pathname).toBe('/cashier/deposit');
    });

    it('should open the currency selection modal', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR1231123: {
                        balance: 20120,
                        currency: 'EUR',
                    },
                },
                loginid: 'CR1231123',
            },
            modules: {
                cfd: {
                    current_list: {
                        CR1231123: {
                            landing_company_short: 'svg',
                        },
                    },
                },
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealAccountCard />, { wrapper });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_currency-switcher__arrow'));
        expect(mock.traders_hub.openModal).toHaveBeenCalled();
    });
});
