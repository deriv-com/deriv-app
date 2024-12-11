import { isDtraderV2DesktopEnabled, isDtraderV2MobileEnabled } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { renderHook } from '@testing-library/react-hooks';

import useIsGrowthbookIsLoaded from '../useIsGrowthbookLoaded';
import { useDtraderV2Flag } from '..';

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        getFeatureValue: jest.fn().mockReturnValue(true),
    },
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('@deriv-com/auth-client', () => ({
    useIsOAuth2Enabled: jest.fn().mockReturnValue(false),
    useOAuth2: jest.fn().mockReturnValue({ isOAuth2Enabled: false }),
}));

jest.mock('../useIsGrowthbookLoaded');

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDtraderV2MobileEnabled: jest.fn(),
    isDtraderV2DesktopEnabled: jest.fn(),
}));

describe('useDtraderV2Flag', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        jest.clearAllMocks();
        (isDtraderV2MobileEnabled as jest.Mock).mockReturnValue(true);
        (isDtraderV2DesktopEnabled as jest.Mock).mockReturnValue(true);
    });

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

    it('should initially set load_dtrader_module and dtrader_v2_enabled_mobile to false', () => {
        (useIsGrowthbookIsLoaded as jest.Mock).mockReturnValue({ isGBLoaded: false, isGBAvailable: true });
        (isDtraderV2MobileEnabled as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useDtraderV2Flag());
        expect(result.current.load_dtrader_module).toBe(false);
        expect(result.current.dtrader_v2_enabled_mobile).toBe(false);
    });

    it('should set load_dtrader_module and dtrader_v2_enabled_mobile to true when dtrader is enabled', () => {
        (useIsGrowthbookIsLoaded as jest.Mock).mockReturnValue({ isGBLoaded: true, isGBAvailable: true });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
        (Analytics.getFeatureValue as jest.Mock).mockReturnValue(true);
        (isDtraderV2MobileEnabled as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useDtraderV2Flag());
        expect(result.current.dtrader_v2_enabled_mobile).toBe(true);
    });

    it('should set load_dtrader_module and dtrader_v2_enabled_desktop to true when dtrader is enabled', () => {
        (useIsGrowthbookIsLoaded as jest.Mock).mockReturnValue({ isGBLoaded: true, isGBAvailable: true });
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });
        (Analytics.getFeatureValue as jest.Mock).mockReturnValue(true);
        (isDtraderV2DesktopEnabled as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useDtraderV2Flag());
        expect(result.current.dtrader_v2_enabled_desktop).toBe(true);
    });
});
