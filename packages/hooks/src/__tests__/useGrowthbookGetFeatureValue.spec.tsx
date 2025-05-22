import { renderHook } from '@testing-library/react-hooks';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';

jest.mock('../useGrowthbookGetFeatureValue', () => {
    return jest.fn(() => [true]);
});

describe('useGrowthbookFeatureFlag', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('The default value for the feature flag must be sent correctly to the package', () => {
        const { result } = renderHook(() =>
            useGrowthbookGetFeatureValue({
                defaultValue: true,
                featureFlag: 'dummy-feature-flag-1',
            })
        );

        const [featureFlagValue] = result.current;

        expect(featureFlagValue).toBe(true);
    });
});
