import { useStore } from '@deriv/stores';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { client } = useStore();
    const { clients_country } = client;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        clients_country &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clients_country);

    const isChangingToHubAppId =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        clients_country &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clients_country);

    return { isHubRedirectionEnabled, isChangingToHubAppId };
};

export default useIsHubRedirectionEnabled;
