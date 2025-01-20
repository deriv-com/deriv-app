import useAuthorize from './useAuthorize';
import useClientCountry from './useClientCountry';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const useIsHubRedirectionEnabled = () => {
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });
    const { data: clientCountry } = useClientCountry();
    const { data: authorize } = useAuthorize();
    const country = authorize?.country ? authorize.country : clientCountry;

    const isHubRedirectionEnabled =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        country &&
        (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(country);

    return { isHubRedirectionEnabled };
};

export default useIsHubRedirectionEnabled;
