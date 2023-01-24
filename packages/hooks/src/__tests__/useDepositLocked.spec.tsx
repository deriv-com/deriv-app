import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen } from '@testing-library/react';
import useDepositLocked from '../useDepositLocked';

const UseDepositLockedExample = () => {
    const is_deposit_locked = useDepositLocked();

    return (
        <>
            <p data-testid={'dt_is_deposit_locked'}>{is_deposit_locked ? 'true' : 'false'}</p>
        </>
    );
};

describe('useDepositLocked', () => {
    test('should be false if none of the conditions are met', () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_eu: false,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('false');
    });

    test('should be true if is_deposit_lock is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: true,
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_eu: false,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });

    test('should be true if is_need_tnc is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: false,
                is_tnc_needed: true,
                is_eu: true,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });

    test('should be true if is_need_financial_assessment is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_eu: false,
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });

    test('should be true if is_need_authentication is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: true,
                is_tnc_needed: false,
                is_eu: true,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });

    test('should be true if is_need_financial_assessment is true and landing_company_shortcode as svg', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_eu: false,
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });

    test('should be true if is_trading_experience_incomplete is true and landing_company_shortcode as maltainvest', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_deposit_lock: false,
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_eu: false,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: true,
                landing_company_shortcode: 'maltainvest',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseDepositLockedExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_deposit_locked = screen.getByTestId('dt_is_deposit_locked');
        expect(is_deposit_locked).toHaveTextContent('true');
    });
});
