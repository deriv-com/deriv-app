import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useTradingPlatformStatus from '../useTradingPlatformStatus';

describe('useTradingPlatformStatus', () => {
    test('should return trading_platform_status', async () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useTradingPlatformStatus(), { wrapper });

        expect(result.current?.data).toEqual([
            { platform: 'mt5', status: 'active' },
            { platform: 'ctrader', status: 'unavailable' },
            { platform: 'dxtrade', status: 'maintenance' },
        ]);
    });
});
