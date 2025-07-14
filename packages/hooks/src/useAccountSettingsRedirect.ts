import { getDomainUrl, routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import useIsHubRedirectionEnabled from './useIsHubRedirectionEnabled';

// Define allowed redirect destinations as a type-safe enum
export type RedirectDestination = 'home' | 'account-limits';

export const useAccountSettingsRedirect = (redirect_to: RedirectDestination = 'home') => {
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
            process.env.NODE_ENV === 'production'
                ? `https://hub.${getDomainUrl()}`
                : `https://staging-hub.${getDomainUrl()}`;

        redirect_url = `${base_url}/accounts/redirect?action=redirect_to&redirect_to=${redirect_to}&account=${account_type}`;
        mobile_redirect_url = `${base_url}/accounts/redirect?action=redirect_to&redirect_to=${redirect_to}&account=${account_type}`;
    } else {
        // Map redirect_to values to specific routes when not using hub redirection
        switch (redirect_to) {
            case 'account-limits':
                redirect_url = routes.account_limits;
                break;
            case 'home':
            default:
                redirect_url = routes.personal_details;
                break;
        }
        mobile_redirect_url = routes.account;
    }

    return { redirect_url, mobile_redirect_url };
};

export default useAccountSettingsRedirect;
