import { useStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import useIsHubRedirectionEnabled from './useIsHubRedirectionEnabled';

export const useAccountSettingsRedirect = () => {
    const { client } = useStore();
    const { loginid, has_wallet } = client;
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();

    // Determine if we should use the new hub endpoints
    const should_use_hub = has_wallet || isHubRedirectionEnabled;

    let redirect_url;

    if (should_use_hub) {
        const base_url =
            process.env.NODE_ENV === 'production' ? 'https://hub.deriv.com' : 'https://staging-hub.deriv.com';

        redirect_url = `${base_url}/accounts/redirect?action=redirect_to&redirect_to=home&account=${loginid}`;
    } else {
        redirect_url = routes.personal_details;
    }

    return { redirect_url };
};

export default useAccountSettingsRedirect;
