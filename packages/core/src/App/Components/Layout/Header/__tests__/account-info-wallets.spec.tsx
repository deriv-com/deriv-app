import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import AccountInfoWallets from '../wallets/account-info-wallets';

describe('AccountInfoWallets component', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock}>{children}</StoreProvider>;
        };
        return Component;
    };

    const default_mock: Partial<typeof mockStore> = {
        client: {
            accounts: {
                CRW909900: {
                    account_category: 'wallet',
                    currency: 'USD',
                    is_virtual: 0,
                    is_disabled: 0,
                    linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    balance: 0,
                },
                CR123: {
                    account_category: 'trading',
                    currency: 'USD',
                    is_virtual: 0,
                    is_disabled: 0,
                    balance: 1234.56,
                },
            },
            loginid: 'CR123',
        },
    };

    it('should show "disabled_message" when "is_disabled" property is "true"', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                        linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    },
                    CR123: {
                        account_category: 'trading',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                    },
                },
                loginid: 'CR123',
            },
            ui: {
                account_switcher_disabled_message: 'test disabled message',
            },
        });

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const popover = screen.getByTestId('dt_popover_wrapper');
        await userEvent.hover(popover);
        const disabled_message = screen.getByText(/test disabled message/i);
        expect(disabled_message).toBeInTheDocument();
    });

    it('should have "acc-info--is-disabled" class when "is_disabled" property is "true"', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                        linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    },
                    CR123: {
                        account_category: 'trading',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                    },
                },
                loginid: 'CR123',
            },
        });

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).toHaveClass('acc-info--is-disabled');
    });

    it('should not have "acc-info--show" class when "is_dialog_on" property is "false"', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).not.toHaveClass('acc-info--show');
    });

    it('can not "toggleDialog" when "is_disabled" property is "true"', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                        linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    },
                    CR123: {
                        account_category: 'trading',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                    },
                },
                loginid: 'CR123',
            },
        });

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const div_element = screen.getByTestId('dt_acc_info');
        await userEvent.click(div_element);
        expect(toggleDialog).toHaveBeenCalledTimes(0);
    });

    it('should render "Options" icon and "WalletIcon"', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        expect(screen.getByTestId('dt_ic_wallet_options')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_icon')).toBeInTheDocument();
    });

    it('should render "DEMO" label', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 1,
                        is_disabled: 0,
                        linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    },
                    CR123: {
                        account_category: 'trading',
                        currency: 'USD',
                        is_virtual: 1,
                        is_disabled: 0,
                    },
                },
                loginid: 'CR123',
            },
        });

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        expect(screen.getByText(/demo/i)).toBeInTheDocument();
    });

    it('should NOT render "SVG" label', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        expect(screen.queryByText('SVG')).not.toBeInTheDocument();
    });

    it('should render "IcLock" icon when "is_disabled" property is "true"', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                        linked_to: [{ loginid: 'CR123', platform: 'dtrade' }],
                    },
                    CR123: {
                        account_category: 'trading',
                        currency: 'USD',
                        is_virtual: 0,
                        is_disabled: 1,
                    },
                },
                loginid: 'CR123',
            },
        });

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const icon = screen.getByTestId('dt_lock_icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render "IcChevronDownBold" icon when "is_disabled" property is "false"', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const icon = screen.getByTestId('dt_select_arrow');
        expect(icon).toBeInTheDocument();
    });

    it('should render balance section when currency exists', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const balance_wrapper = screen.queryByTestId('dt_balance');
        expect(balance_wrapper).toBeInTheDocument();
    });

    it('should have "1.234.56 USD" text', () => {
        const mock = mockStore(default_mock);

        const toggleDialog = jest.fn();
        render(<AccountInfoWallets is_dialog_on={false} toggleDialog={toggleDialog} />, { wrapper: wrapper(mock) });

        const text = screen.getByText('1,234.56 USD');
        expect(text).toBeInTheDocument();
        expect(screen.queryByText(/no currency assigned/i)).not.toBeInTheDocument();
    });
});
