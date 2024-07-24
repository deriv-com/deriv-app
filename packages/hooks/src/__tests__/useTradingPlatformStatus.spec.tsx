import * as React from 'react';
import { APIProvider, useQuery } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useTradingPlatformStatus from '../useTradingPlatformStatus';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'trading_platform_status'>>;

describe('useTradingPlatformStatus', () => {
    test('should return trading_platform_status', async () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                trading_platform_status: [
                    {
                        platform: 'mt5',
                        status: 'active',
                    },
                ],
            },
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useTradingPlatformStatus(), { wrapper });

        expect(result.current.data).toEqual([
            {
                platform: 'mt5',
                status: 'active',
            },
        ]);
    });
});
