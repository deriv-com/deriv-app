import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';
import { useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { mobileOSDetect } from '@deriv/shared';

const useGetPasskeysList = () => {
    const { client } = useStore();
    const { is_passkey_supported, is_logged_in } = client;

    const { data, error, isLoading, refetch, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: is_passkey_supported && is_logged_in,
        },
    });

    useEffect(() => {
        if (error) {
            Analytics.trackEvent('ce_passkey_account_settings_form', {
                action: 'error',
                form_name: 'ce_passkey_account_settings_form',
                operating_system: mobileOSDetect(),
                error_message: error?.message,
            });
        }
    }, [error]);

    return {
        passkeys_list: data?.passkeys_list,
        passkeys_list_error: error ?? null,
        reloadPasskeysList: refetch,
        is_passkeys_list_loading: isLoading,
        ...rest,
    };
};

export default useGetPasskeysList;
