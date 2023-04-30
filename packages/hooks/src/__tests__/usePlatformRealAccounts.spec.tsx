import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformRealAccounts from '../usePlatformRealAccounts';

describe('usePlatformRealAccounts', () => {
    test('should return null when user has no platform demo accounts', async () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
            client: {
                active_accounts: [
                    {
                        landing_company_shortcode: 'svg',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformRealAccounts(), { wrapper });

        expect(result.current.length).toBe(1);
    });
});
