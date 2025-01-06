import { useEffect, useMemo, useState } from 'react';

import { Analytics } from '@deriv-com/analytics';

import useActiveWalletAccount from './useActiveWalletAccount';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';
import useSettings from './useSettings';

interface UseGrowthbookIsOneArgs {
    featureFlag: string;
}

const useGrowthbookIsOn = ({ featureFlag }: UseGrowthbookIsOneArgs) => {
    const [featureIsOn, setFeatureIsOn] = useState(Analytics?.isFeatureOn(featureFlag));
    const isGBLoaded = useIsGrowthbookIsLoaded();
    const { data: settings } = useSettings();
    const { data: activeWallet } = useActiveWalletAccount();

    const client_accounts = localStorage.getItem('client.accounts');
    const client_accounts_list = client_accounts ? JSON.parse(client_accounts) : [];
    const residence =
        client_accounts_list.length > 0 && activeWallet?.loginid
            ? client_accounts_list.find((account: typeof activeWallet) => account?.loginid === activeWallet?.loginid)
                  ?.residence
            : settings?.country_code;

    const analytics_config = useMemo(() => {
        return {
            residence_country: residence || '',
        };
    }, [residence]);

    useEffect(() => {
        if (isGBLoaded) {
            if (Analytics?.getInstances()?.ab) {
                const setFeatureValue = () => {
                    Analytics.setAttributes(analytics_config);
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
    }, [isGBLoaded, featureFlag, analytics_config]);

    return [featureIsOn, isGBLoaded];
};

export default useGrowthbookIsOn;
