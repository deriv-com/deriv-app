import useClientCountry from './useClientCountry';
import useRemoteConfig from './useRemoteConfig';
import useSettings from './useSettings';

const useIsHubRedirectionEnabled = () => {
    const { data } = useRemoteConfig();
    const hub_enabled_country_list = data?.hub_enabled_country_list ?? [];

    const { data: clientCountry } = useClientCountry();
    const { data: accountSettings } = useSettings();
    const countryCode = accountSettings?.country_code;

    const isHubRedirectionEnabled =
        Array.isArray(hub_enabled_country_list) && countryCode && hub_enabled_country_list.includes(countryCode);

    const isChangingToHubAppId =
        Array.isArray(hub_enabled_country_list) && clientCountry && hub_enabled_country_list.includes(clientCountry);

    return {
        isHubRedirectionEnabled,
        isChangingToHubAppId,
        isHubRedirectionLoaded: !!hub_enabled_country_list.length,
    };
};

export default useIsHubRedirectionEnabled;
