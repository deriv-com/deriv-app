import React from 'react';
import { Redirect } from 'react-router-dom';
import { useGetPasskeysList } from '@deriv/api';
import { Loading } from '@deriv/components';
import { useIsPasskeySupported } from '@deriv/hooks';
import { PlatformContext, routes } from '@deriv/shared';
import { useBreakpoint } from '@deriv/quill-design';
import NoPasskeysSet from './no-passkeys-set';
import './passkeys.scss';

const Passkeys = () => {
    const { is_passkeys_enabled } = React.useContext(PlatformContext);
    const { is_passkey_supported, is_loading: is_passkey_support_checked } = useIsPasskeySupported();
    const { isMobile } = useBreakpoint();
    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && isMobile;

    const { data: passkeys_list, isLoading: is_passkeys_list_loading } = useGetPasskeysList();

    if (is_passkey_support_checked || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    return <div className='passkeys'>{!passkeys_list.length && <NoPasskeysSet />}</div>;
};

export default Passkeys;
