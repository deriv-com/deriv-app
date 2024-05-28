import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';
import useIsGrowthbookIsLoaded from '../useIsGrowthbookLoaded';
import useGrowthbookIsOn from '../useGrowthbookIsOn';

jest.mock('@deriv/api');
jest.mock('@deriv-com/analytics');
jest.mock('../useIsGrowthbookLoaded');

describe('useGrowthbookIsOn', () => {
    const mockFeatureFlag = 'test_feature_flag';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        useRemoteConfig.mockReturnValue({ data: {} });
        useIsGrowthbookIsLoaded.mockReturnValue(false);
        Analytics.isFeatureOn = jest.fn(() => false);

        const { result } = renderHook(() => useGrowthbookIsOn({ featureFlag: mockFeatureFlag }));

        expect(result.current[0]).toBe(false); // featureIsOn
        expect(result.current[1]).toBe(false); // isGBLoaded
    });

    it('should update state when data.marketing_growthbook and isGBLoaded change', () => {
        useRemoteConfig.mockReturnValue({ data: { marketing_growthbook: true } });
        useIsGrowthbookIsLoaded.mockReturnValue(true);
        Analytics.isFeatureOn = jest.fn(() => true);
        Analytics.getInstances = jest.fn(() => ({
            ab: {
                GrowthBook: {
                    setRenderer: jest.fn(),
                },
            },
        }));

        const { result } = renderHook(() => useGrowthbookIsOn({ featureFlag: mockFeatureFlag }));

        expect(result.current[0]).toBe(true); // featureIsOn
        expect(result.current[1]).toBe(true); // isGBLoaded
    });

    it('should set feature value when Analytics instances are available', () => {
        useRemoteConfig.mockReturnValue({ data: { marketing_growthbook: true } });
        useIsGrowthbookIsLoaded.mockReturnValue(true);
        Analytics.isFeatureOn = jest.fn(() => false);
        const setRendererMock = jest.fn();

        Analytics.getInstances = jest.fn(() => ({
            ab: {
                GrowthBook: {
                    setRenderer: setRendererMock,
                },
            },
        }));

        const { result } = renderHook(() => useGrowthbookIsOn({ featureFlag: mockFeatureFlag }));

        expect(result.current[0]).toBe(false); // featureIsOn
        expect(setRendererMock).toHaveBeenCalled();
    });
});
