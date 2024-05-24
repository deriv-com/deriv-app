import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';

interface UseGrowthbookIsOneArgs {
    featureFlag: string;
}

const useGrowthbookIsOn = ({ featureFlag }: UseGrowthbookIsOneArgs) => {
    const [featureIsOn, setFeatureIsOn] = useState(Analytics?.isFeatureOn(featureFlag));
    const { data } = useRemoteConfig();
    const isGBLoaded = useIsGrowthbookIsLoaded();

    useEffect(() => {
        if (data?.marketing_growthbook && isGBLoaded) {
            if (Analytics?.getInstances()?.ab) {
                const setFeatureValue = () => {
                    const value = Analytics?.isFeatureOn(featureFlag);
                    setFeatureIsOn(value);
                };
                setFeatureValue();
                Analytics?.getInstances()?.ab?.GrowthBook?.setRenderer(() => {
                    // this will be called whenever the feature flag value changes and acts as a event listener
                    setFeatureValue();
                });
            }
        }
    }, [isGBLoaded, data.marketing_growthbook, featureFlag]);

    return [featureIsOn, isGBLoaded];
};

export default useGrowthbookIsOn;
