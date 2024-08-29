import * as React from 'react';
import { WS } from '@deriv/shared';
import { renderHook } from '@testing-library/react-hooks';
import useTradingPlatformStatus from '../useTradingPlatformStatus';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(),
    },
}));

describe('useTradingPlatformStatus', () => {
    beforeEach(() => {
        (WS.send as jest.Mock).mockResolvedValue({
            trading_platform_status: [
                {
                    platform: 'mt5',
                    status: 'active',
                },
            ],
        });
    });

    it('should call trading_platform_status endpoint', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useTradingPlatformStatus());

        await waitForNextUpdate();

        expect(WS.send).toHaveBeenCalledWith({ trading_platform_status: 1 });

        expect(result.current.data).toEqual([
            {
                platform: 'mt5',
                status: 'active',
            },
        ]);
    });
});
