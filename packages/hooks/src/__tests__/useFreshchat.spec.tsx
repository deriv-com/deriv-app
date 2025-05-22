import { useScript } from 'usehooks-ts';

import { act, renderHook } from '@testing-library/react-hooks';

import useFreshChat, { useIsFreshchatAvailable } from '../useFreshchat';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';

// Mock dependencies
jest.mock('usehooks-ts', () => ({
    useScript: jest.fn(),
}));

jest.mock('../useGrowthbookGetFeatureValue', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useFreshChat', () => {
    const mockFreshChat = {
        initialize: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (global.window as any).FreshChat = mockFreshChat;
        (global.window as any).fcSettings = {};
        jest.useFakeTimers();
        (global.window as any).fcWidget = { isInitialized: jest.fn() };
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should not initialize FreshChat when feature flag is disabled', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false]);
        (useScript as jest.Mock).mockReturnValue('ready');

        renderHook(() => useFreshChat('test-token'));

        expect(mockFreshChat.initialize).not.toHaveBeenCalled();
    });

    it('should initialize FreshChat when feature flag is enabled and script is ready', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('ready');

        renderHook(() => useFreshChat('test-token'));

        expect(mockFreshChat.initialize).toHaveBeenCalledWith({
            hideButton: true,
            token: 'test-token',
        });
    });

    it('should not initialize when script is not ready', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('loading');

        renderHook(() => useFreshChat('test-token'));

        expect(mockFreshChat.initialize).not.toHaveBeenCalled();
    });
});

describe('useIsFreshchatAvailable', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        (window as any).fcWidget = { isInitialized: jest.fn() };
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return true when Freshchat is initialized', () => {
        ((window as any).fcWidget.isInitialized as jest.Mock).mockReturnValue(true);

        const { result } = renderHook(() => useIsFreshchatAvailable());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(result.current).toBe(true);
    });

    it('should return false when Freshchat initialization times out', () => {
        ((window as any).fcWidget.isInitialized as jest.Mock).mockReturnValue(false);

        const { result } = renderHook(() => useIsFreshchatAvailable());

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(result.current).toBe(false);
    });
});
