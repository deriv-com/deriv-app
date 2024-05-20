import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';

interface UseGrowthbookFeatureFlagArgs {
    featureFlag: string;
}

const useGrowthbookFeatureFlag = ({ featureFlag }: UseGrowthbookFeatureFlagArgs) => {
    const [featureFlagValue, setFeatureFlagValue] = useState(Analytics?.getFeatureValue(featureFlag));
    const { data } = useRemoteConfig();

    useEffect(() => {
        if (data.marketing_growthbook) {
            let timeout = 0;
            const analytics_interval = setInterval(() => {
                // Check if the analytics instance is available for ten seconds before setting the feature flag value
                if (timeout > 10) {
                    // If the analytics instance is not available after 10 seconds, clear the interval
                    clearInterval(analytics_interval);
                    return;
                }
                timeout += 1;
                if (Analytics.getInstances().ab) {
                    const setFeatureValue = () => {
                        const value = Analytics?.getFeatureValue(featureFlag);
                        setFeatureFlagValue(value);
                    };
                    setFeatureValue();
                    Analytics.getInstances()?.ab?.GrowthBook?.setRenderer(() => {
                        // this will be called whenever the feature flag value changes and acts as a event listener
                        setFeatureValue();
                    });
                    clearInterval(analytics_interval);
                }
            }, 1000);
        }
        return () => {
            clearInterval(analytics_interval);
        };
    }, []);

    return featureFlagValue;
};

export default useGrowthbookFeatureFlag;
