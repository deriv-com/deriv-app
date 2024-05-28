import { renderHook, act } from '@testing-library/react-hooks';
import { useRemoteConfig } from '@deriv/api';
import { Analytics } from '@deriv-com/analytics';
import useIsGrowthbookIsLoaded from '../useIsGrowthbookLoaded';

jest.mock('@deriv/api');
jest.mock('@deriv-com/analytics');

describe('useIsGrowthbookIsLoaded', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        useRemoteConfig.mockReturnValue({ data: {} });

        const { result } = renderHook(() => useIsGrowthbookIsLoaded());

        expect(result.current).toBe(false); // isGBLoaded
    });

    it('should update state when data.marketing_growthbook is true and Analytics instance is available', () => {
        jest.useFakeTimers();
        useRemoteConfig.mockReturnValue({ data: { marketing_growthbook: true } });
        Analytics.getInstances = jest.fn(() => ({}));

        const { result, rerender } = renderHook(() => useIsGrowthbookIsLoaded());

        expect(result.current).toBe(false); // isGBLoaded initially false

        act(() => {
            Analytics.getInstances.mockReturnValueOnce({ ab: true });

            jest.advanceTimersByTime(500); // Move timer forward by 500ms
            rerender();
        });

        expect(result.current).toBe(true); // isGBLoaded should be true
    });

    it('should clear interval after 10 seconds if Analytics instance is not available', () => {
        jest.useFakeTimers();
        useRemoteConfig.mockReturnValue({ data: { marketing_growthbook: true } });
        Analytics.getInstances = jest.fn(() => ({}));

        const { result } = renderHook(() => useIsGrowthbookIsLoaded());

        expect(result.current).toBe(false); // isGBLoaded initially false

        act(() => {
            jest.advanceTimersByTime(11000); // Move timer forward by 11 seconds
        });

        expect(result.current).toBe(false); // isGBLoaded should still be false
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('should clear interval on unmount', () => {
        jest.useFakeTimers();
        useRemoteConfig.mockReturnValue({ data: { marketing_growthbook: true } });

        const { unmount } = renderHook(() => useIsGrowthbookIsLoaded());

        unmount();

        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
});
