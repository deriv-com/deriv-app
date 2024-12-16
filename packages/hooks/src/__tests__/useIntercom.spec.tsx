import { useScript } from 'usehooks-ts';

import { renderHook } from '@testing-library/react-hooks';

import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useIntercom from '../useIntercom';

jest.mock('usehooks-ts', () => ({
    useScript: jest.fn(),
}));

jest.mock('../useGrowthbookGetFeatureValue', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useIntercom', () => {
    const mockInitialize = jest.fn();
    const mockDerivInterCom = {
        initialize: mockInitialize,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset window.DerivInterCom and window.Intercom before each test
        delete (window as any).DerivInterCom;
        delete (window as any).Intercom;
    });

    it('should not initialize Intercom when feature flag is disabled', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false]);
        (useScript as jest.Mock).mockReturnValue('ready');

        renderHook(() => useIntercom('test-token'));

        expect(mockInitialize).not.toHaveBeenCalled();
    });

    it('should not initialize Intercom when script is not ready', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('loading');

        renderHook(() => useIntercom('test-token'));

        expect(mockInitialize).not.toHaveBeenCalled();
    });

    it('should not initialize Intercom when DerivInterCom is not available', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('ready');

        renderHook(() => useIntercom('test-token'));

        expect(mockInitialize).not.toHaveBeenCalled();
    });

    it('should initialize Intercom when all conditions are met', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('ready');
        (window as any).DerivInterCom = mockDerivInterCom;

        renderHook(() => useIntercom('test-token'));

        expect(mockInitialize).toHaveBeenCalledWith({
            hideLauncher: true,
            token: 'test-token',
        });
    });

    it('should clean up interval on unmount', () => {
        jest.spyOn(global, 'clearInterval');
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('ready');
        (window as any).DerivInterCom = mockDerivInterCom;

        const { unmount } = renderHook(() => useIntercom('test-token'));

        unmount();

        expect(global.clearInterval).toHaveBeenCalled();
    });

    it('should clear interval when Intercom becomes available', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearInterval');
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        (useScript as jest.Mock).mockReturnValue('ready');
        (window as any).DerivInterCom = mockDerivInterCom;

        renderHook(() => useIntercom('test-token'));

        // Simulate Intercom becoming available
        (window as any).Intercom = {};

        jest.advanceTimersByTime(500);

        expect(global.clearInterval).toHaveBeenCalled();

        jest.useRealTimers();
    });
});
