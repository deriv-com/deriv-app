import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';

interface UseGrowthbookGetFeatureValueArgs<T> {
    featureFlag: string;
    defaultValue?: T;
}

const useGrowthbookGetFeatureValue = <T extends string | boolean>({
    featureFlag,
    defaultValue,
}: UseGrowthbookGetFeatureValueArgs<T>) => {
    const resolvedDefaultValue: T = defaultValue !== undefined ? defaultValue : (false as T);
    const [featureFlagValue, setFeatureFlagValue] = useState(
        Analytics?.getFeatureValue(featureFlag, resolvedDefaultValue) ?? resolvedDefaultValue
    );
    const isGBLoaded = useIsGrowthbookIsLoaded();
    const { data } = useRemoteConfig();

    useEffect(() => {
        if (data?.marketing_growthbook && isGBLoaded) {
            if (Analytics?.getInstances()?.ab) {
                const setFeatureValue = () => {
                    const value = Analytics?.getFeatureValue(featureFlag, resolvedDefaultValue);
                    setFeatureFlagValue(value);
                };
                setFeatureValue();
                Analytics?.getInstances()?.ab?.GrowthBook?.setRenderer(() => {
                    // this will be called whenever the feature flag value changes and acts as a event listener
                    setFeatureValue();
                });
            }
        }
    }, [isGBLoaded, data.marketing_growthbook, resolvedDefaultValue, featureFlag]);

    return [featureFlagValue, isGBLoaded];
};

export default useGrowthbookGetFeatureValue;
