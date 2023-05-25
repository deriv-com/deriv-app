import React from 'react';
import MT5AccountTypeModal from '../account-type-modal';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

let modal_root_el: HTMLDivElement;
beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

describe('MT5AccountTypeModal', () => {
    it('should render the component', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    setAccountType: {
                        category: 'real',
                        type: 'synthetic',
                    },
                },
            },
            traders_hub: {
                is_account_type_modal_visible: true,
                account_type_card: 'Derived',
            },
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                    },
                    {
                        market_type: 'gaming',
                    },
                ],
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<MT5AccountTypeModal />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render the proper text for the modal', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    setAccountType: {
                        category: 'real',
                        type: 'synthetic',
                    },
                },
            },
            traders_hub: {
                is_account_type_modal_visible: true,
                account_type_card: 'Derived',
            },
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                    },
                    {
                        market_type: 'gaming',
                    },
                ],
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<MT5AccountTypeModal />, { wrapper });
        expect(screen.getByText("Select Deriv MT5's account type")).toBeInTheDocument();
        expect(screen.getByText('Derived')).toBeInTheDocument();
        expect(
            screen.getByText('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.')
        ).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(
            screen.getByText('Trade CFDs on MT5 with forex, stock indices, commodities, and cryptocurrencies.')
        ).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should call setAccountType with the correct parameters when clicking on the next button for desktop', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    setAccountType: jest.fn(),
                },
            },
            traders_hub: {
                is_account_type_modal_visible: true,
                account_type_card: 'Derived',
            },
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                    },
                    {
                        market_type: 'gaming',
                    },
                ],
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<MT5AccountTypeModal />, { wrapper });
        userEvent.click(screen.getByText('Next'));
        expect(mock.modules.cfd.setAccountType).toHaveBeenCalledWith({ category: 'real', type: 'synthetic' });
        expect(mock.traders_hub.toggleAccountTypeModalVisibility).toHaveBeenCalled();
    });

    it('should call setAccountType with real and financial when clicking on the financial card for desktop', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    setAccountType: jest.fn(),
                },
            },
            traders_hub: {
                is_account_type_modal_visible: true,
                account_type_card: 'Financial',
            },
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                    },
                    {
                        market_type: 'gaming',
                    },
                ],
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<MT5AccountTypeModal />, { wrapper });
        userEvent.click(screen.getByText('Next'));
        expect(mock.modules.cfd.setAccountType).toHaveBeenCalledWith({ category: 'real', type: 'financial' });
        expect(mock.traders_hub.toggleAccountTypeModalVisibility).toHaveBeenCalled();
    });
});
