import { useClientCountry, useSettings } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';

import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useClientCountry: jest.fn(() => ({ data: 'US' })),
    useSettings: jest.fn(() => ({ data: { citizen: 'US' } })),
}));

jest.mock('../useGrowthbookGetFeatureValue', () =>
    jest.fn(() => [
        {
            hub_enabled_country_list: [''],
        },
    ])
);

describe('useIsHubRedirectionEnabled', () => {
    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useIsHubRedirectionEnabled());

        expect(result.current.isHubRedirectionEnabled).toBe(false);
    });

    it('should return false if client country is not in the hub enabled list', () => {
        (useClientCountry as jest.Mock).mockReturnValue({ data: 'UK' });
        (useSettings as jest.Mock).mockReturnValue({ data: { citizen: 'UK' } });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['US', 'AU'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled());
        expect(result.current.isHubRedirectionEnabled).toBe(false);
    });

    it('should return true if client country is in the hub enabled list', () => {
        (useClientCountry as jest.Mock).mockReturnValue({ data: 'UK' });
        (useSettings as jest.Mock).mockReturnValue({ data: { citizen: 'UK' } });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['US', 'AU', 'UK'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled());
        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });

    it('should return true if client country is in the hub enabled list but not in the citizen list', () => {
        (useClientCountry as jest.Mock).mockReturnValue({ data: 'UK' });
        (useSettings as jest.Mock).mockReturnValue({ data: { citizen: 'MY' } });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([
            {
                hub_enabled_country_list: ['US', 'AU', 'UK'],
            },
        ]);
        const { result } = renderHook(() => useIsHubRedirectionEnabled());
        expect(result.current.isHubRedirectionEnabled).toBe(true);
    });
});
