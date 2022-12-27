import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen } from '@testing-library/react';
import useNeedTNC from '../useNeedTNC';

const UseNeedTNCExample = () => {
    const is_need_tnc = useNeedTNC();

    return (
        <>
            <p data-testid={'dt_is_need_tnc'}>{is_need_tnc ? 'true' : 'false'}</p>
        </>
    );
};

describe('useNeedTNC', () => {
    test('should be false if is_tnc_needed and is_eu are false and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: false,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('false');
    });

    test('should be false if is_tnc_needed is false but is_eu is true and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('false');
    });

    test('should be false if is_tnc_needed and is_eu are false but has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('false');
    });

    test('should be true if is_tnc_needed is true and is_eu is false but has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: false,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('true');
    });

    test('should be true if is_tnc_needed and is_eu are true and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('true');
    });

    test('should be true if is_tnc_needed and is_eu are true and has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        render(<UseNeedTNCExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_tnc = screen.getByTestId('dt_is_need_tnc');
        expect(is_need_tnc).toHaveTextContent('true');
    });
});
