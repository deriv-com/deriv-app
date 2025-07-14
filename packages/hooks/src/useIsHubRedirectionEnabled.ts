import Cookies from 'js-cookie';

import { useRemoteConfig } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useIsHubRedirectionEnabled = () => {
    const { data } = useRemoteConfig(true);
    const hub_enabled_country_list = (data?.hub_enabled_country_list as string[]) ?? [];
    const { client } = useStore();
    const { account_settings, clients_country } = client;

    const cookieCountry = JSON.parse(Cookies.get('client_information') || '{}')?.residence;
    const userCountry = cookieCountry || account_settings?.country_code;

    const isHubRedirectionEnabled =
        Array.isArray(hub_enabled_country_list) && userCountry && hub_enabled_country_list.includes(userCountry);

    const isChangingToHubAppId =
        Array.isArray(hub_enabled_country_list) &&
        clients_country &&
        hub_enabled_country_list.includes(clients_country);

    return {
        isHubRedirectionEnabled,
        isChangingToHubAppId,
        isHubRedirectionLoaded: !!hub_enabled_country_list.length,
    };
};

export default useIsHubRedirectionEnabled;
