import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformAccounts from './usePlatformAccounts';

describe('usePlatformAccounts', () => {
    // test('should return default currency when user has no account', async () => {
    //     const mock = mockStore({
    //         client: {
    //             account_list: [],
    //         },
    //     });
    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => usePlatformAccounts(), { wrapper });
    //     expect(result.current.demo).toBe(0);
    // });
});
