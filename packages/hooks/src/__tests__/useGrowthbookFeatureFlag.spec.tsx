import { renderHook } from '@testing-library/react-hooks';
import useGrowthbookFeatureFlag from '../useGrowthbookFeatureFlag';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';

jest.mock('@deriv/api');
jest.mock('@tanstack/react-query');
jest.mock('@deriv-com/analytics');

describe('useGrowthbookFeatureFlag', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockData = { marketing_growthbook: true };

    test('Should call getFeatureValue from the package', async () => {
        (useRemoteConfig as jest.Mock).mockImplementation(() => ({
            data: mockData,
        }));
        const { result } = renderHook(() =>
            useGrowthbookFeatureFlag({
                defaultValue: false,
                featureFlag: 'dummy-feature-flag',
            })
        );
        const [featureFlagValue] = result.current;

        expect(featureFlagValue).toBe(false);
        expect(Analytics.getFeatureValue).toHaveBeenCalled();
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('dummy-feature-flag', false);
    });

    test('The default value for the feature flag must be sent correctly to the package', async () => {
        (useRemoteConfig as jest.Mock).mockImplementation(() => ({
            data: mockData,
        }));
        renderHook(() =>
            useGrowthbookFeatureFlag({
                defaultValue: true,
                featureFlag: 'dummy-feature-flag-1',
            })
        );

        expect(Analytics.getFeatureValue).toHaveBeenCalled();
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('dummy-feature-flag-1', true);
    });
});
