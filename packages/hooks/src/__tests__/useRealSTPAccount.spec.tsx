import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useRealSTPAccount from '../useRealSTPAccount';

describe('useRealSTPAccount', () => {
    test('should be false if does not have an account type of real with sub account type of financial_stp', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                    {
                        account_type: 'real',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealSTPAccount(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if has an account type of real with sub account type of financial_stp', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealSTPAccount(), { wrapper });

        expect(result.current).toBe(true);
    });
});
