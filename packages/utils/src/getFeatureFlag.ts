// eslint-disable-next-line import/no-extraneous-dependencies
import { Analytics } from '@deriv-com/analytics';

const waitForGrowthbook = () => {
    return new Promise(resolve => {
        const checkAnalytics = () => {
            if (typeof Analytics !== 'undefined' && Analytics.getInstances()?.ab !== undefined) {
                resolve(Analytics);
            } else {
                setTimeout(checkAnalytics, 50);
            }
        };

        checkAnalytics();
    });
};

const getFeatureFlag = async (feature: string, defaultValue?: string | boolean | undefined) => {
    let enabled = false;
    await waitForGrowthbook();

    if (Analytics) {
        const status = await Analytics?.getGrowthbookStatus();
        // If Growthbook has config error, down or encountering issues, feature flag will default to false
        if (status.isLoaded && !status.error) {
            enabled = Analytics.getFeatureValue(feature, !!defaultValue);
        }
    }

    return enabled;
};

export default getFeatureFlag;
