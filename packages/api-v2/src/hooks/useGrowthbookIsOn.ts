import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';

interface UseGrowthbookIsOneArgs {
    featureFlag: string;
}

const useGrowthbookIsOn = ({ featureFlag }: UseGrowthbookIsOneArgs) => {
    const [featureIsOn, setFeatureIsOn] = useState(Analytics?.isFeatureOn(featureFlag));
    const isGBLoaded = useIsGrowthbookIsLoaded();

    useEffect(() => {
        if (isGBLoaded) {
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
    }, [isGBLoaded, featureFlag]);

    return [featureIsOn, isGBLoaded];
};

export default useGrowthbookIsOn;
