import { useClientCountry, useSettings } from '@deriv/api';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { data: clientCountry } = useClientCountry();
    const { data: accountSettings } = useSettings();
    const { citizen } = accountSettings;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        ((citizen && (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(citizen)) ||
            (clientCountry &&
                (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clientCountry)));

    return { isHubRedirectionEnabled };
};

export default useIsHubRedirectionEnabled;
