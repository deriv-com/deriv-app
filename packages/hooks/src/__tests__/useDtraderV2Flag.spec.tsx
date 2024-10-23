import { renderHook } from '@testing-library/react-hooks';
import { useDtraderV2Flag } from '..';
import useIsGrowthbookIsLoaded from '../useIsGrowthbookLoaded';
import { useDevice } from '@deriv-com/ui';
import { Analytics } from '@deriv-com/analytics';

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        getFeatureValue: jest.fn().mockReturnValue(true),
    },
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('../useIsGrowthbookLoaded');

describe('useDtraderV2Flag', () => {
    const originalLocation = window.location;
    beforeAll(() => {
        const mockLocation = {
            ...originalLocation,
            pathname: '/dtrader',
        };

        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true,
        });
    });

    afterAll(() => {
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
        });
    });

    it('should initially set load_dtrader_module and dtrader_v2_enabled to false', () => {
        (useIsGrowthbookIsLoaded as jest.Mock).mockReturnValue({ isGBLoaded: false, isGBNotAvailable: false });
        const { result } = renderHook(() => useDtraderV2Flag());
        expect(result.current.load_dtrader_module).toBe(false);
        expect(result.current.dtrader_v2_enabled).toBe(false);
    });

    it('should set load_dtrader_module and dtrader_v2_enabled to true when dtrader is enabled', () => {
        (useIsGrowthbookIsLoaded as jest.Mock).mockReturnValue({ isGBLoaded: true, isGBNotAvailable: false });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
        (Analytics.getFeatureValue as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useDtraderV2Flag());
        expect(result.current.dtrader_v2_enabled).toBe(true);
    });
});
