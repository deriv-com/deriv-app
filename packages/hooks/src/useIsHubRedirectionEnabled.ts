import { useStore } from '@deriv/stores';

import useAuthorize from './useAuthorize';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { data: authorize } = useAuthorize();
    const { client } = useStore();
    const { clients_country } = client;
    const country = authorize?.country ? authorize.country : clients_country;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        country &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(country);

    return { isHubRedirectionEnabled };
};

export default useIsHubRedirectionEnabled;
