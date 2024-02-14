import { renderHook } from '@testing-library/react-hooks';
import useGrowthbookFeatureFlag from '../useGrowthbookFeatureFlag';
import { Analytics } from '@deriv-com/analytics';

describe('useGrowthbookFeatureFlag', () => {
    test('Should call getFeatureValue from the package', async () => {
        const { result } = renderHook(() =>
            useGrowthbookFeatureFlag({
                defaultValue: false,
                featureFlag: 'dummy-feature-flag',
            })
        );

        expect(result.current).toBe(false);
        expect(Analytics.getFeatureValue).toHaveBeenCalled();
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('dummy-feature-flag', false);
    });

    test('The default value for the feature flag must be sent correctly to the package', async () => {
        const { result } = renderHook(() =>
            useGrowthbookFeatureFlag({
                defaultValue: true,
                featureFlag: 'dummy-feature-flag-1',
            })
        );

        expect(result.current).toBe(true);
        expect(Analytics.getFeatureValue).toHaveBeenCalled();
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('dummy-feature-flag-1', true);
    });
});
