import useClientCountry from './useClientCountry';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';
import useSettings from './useSettings';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { data: clientCountry } = useClientCountry();
    const { data: accountSettings } = useSettings();
    const { country_code: countryCode } = accountSettings;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        countryCode &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(countryCode);

    const isChangingToHubAppId =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        clientCountry &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clientCountry);

    return { isHubRedirectionEnabled, isChangingToHubAppId };
};

export default useIsHubRedirectionEnabled;
