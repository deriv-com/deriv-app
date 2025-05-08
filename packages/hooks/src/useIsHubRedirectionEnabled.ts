import Cookies from 'js-cookie';

import { useStore } from '@deriv/stores';

import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList, isHubRedirectionLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { client } = useStore();
    const { account_settings, clients_country } = client;

    const cookieCountry = JSON.parse(Cookies.get('client_information') || '{}')?.residence;

    const userCountry = cookieCountry || account_settings.country_code;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        userCountry &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(userCountry);

    const isChangingToHubAppId =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        clients_country &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clients_country);

    return { isHubRedirectionEnabled, isChangingToHubAppId, isHubRedirectionLoaded };
};

export default useIsHubRedirectionEnabled;
