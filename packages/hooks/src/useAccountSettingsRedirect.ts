import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import useIsHubRedirectionEnabled from './useIsHubRedirectionEnabled';

export const useAccountSettingsRedirect = () => {
    const { client } = useStore();
    const { has_wallet } = client;
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
    const search_params = new URLSearchParams(window.location.search);
    const account_type = search_params.get('account');

    let redirect_url, mobile_redirect_url;

    // Determine if we should use the new hub endpoints
    const should_use_hub = has_wallet && isHubRedirectionEnabled;

    if (should_use_hub) {
        const base_url =
            process.env.NODE_ENV === 'production' ? 'https://hub.deriv.com' : 'https://staging-hub.deriv.com';

        redirect_url = `${base_url}/accounts/redirect?action=redirect_to&redirect_to=home&account=${account_type}`;
        mobile_redirect_url = `${base_url}/accounts/redirect?action=redirect_to&redirect_to=home&account=${account_type}`;
    } else {
        redirect_url = routes.personal_details;
        mobile_redirect_url = routes.account;
    }

    return { redirect_url, mobile_redirect_url };
};

export default useAccountSettingsRedirect;
