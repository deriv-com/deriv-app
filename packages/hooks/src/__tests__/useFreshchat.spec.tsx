import { useScript } from 'usehooks-ts';

import { renderHook } from '@testing-library/react-hooks';

import useFreshChat from '../useFreshchat';
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
        global.window.FreshChat = mockFreshChat;
        global.window.fcSettings = {};
        jest.useFakeTimers();
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
