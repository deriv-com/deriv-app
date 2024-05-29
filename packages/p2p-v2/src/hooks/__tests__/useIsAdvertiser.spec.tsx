import { p2p } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useIsAdvertiser from '../useIsAdvertiser';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({
                data: {
                    currency: 'USD',
                },
                isLoading: false,
                subscribe: jest.fn(),
                unsubscribe: jest.fn(),
            }),
        },
    },
}));

const mockUseGetInfo = p2p.advertiser.useGetInfo as jest.MockedFunction<typeof p2p.advertiser.useGetInfo>;

describe('useIsAdvertiser', () => {
    it('should return true if data is not empty and there is no error in the response', () => {
        const { result } = renderHook(() => useIsAdvertiser());
        expect(result.current).toBeTruthy();
    });

    it('should return false if error.code is AdvertiserNotFound, and data is empty', () => {
        (mockUseGetInfo as jest.Mock).mockReturnValueOnce({
            ...mockUseGetInfo,
            data: {},
            error: {
                code: 'AdvertiserNotFound',
            },
        });

        const { result } = renderHook(() => useIsAdvertiser());
        expect(result.current).toBeFalsy();
    });
});
