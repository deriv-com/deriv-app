import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';
import { useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { getOSNameWithUAParser } from '@deriv/shared';
import useAuthorize from './useAuthorize';

const useGetPasskeysList = () => {
    const { client } = useStore();
    const { isSuccess } = useAuthorize();
    const { is_passkey_supported } = client;

    const { data, error, isLoading, refetch, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: is_passkey_supported && isSuccess,
            retry: 0,
        },
    });

    useEffect(() => {
        if (error) {
            // TODO: remove ts ignore after adding types to Analytics
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Analytics.trackEvent('ce_passkey_account_settings_form', {
                action: 'error',
                form_name: 'ce_passkey_account_settings_form',
                operating_system: getOSNameWithUAParser(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
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
