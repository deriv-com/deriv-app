import React from 'react';
import { PlatformContext, routes } from '@deriv/shared';
import { Redirect } from 'react-router-dom';
import { useIsPasskeySupported } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const Passkeys = observer(() => {
    const { is_passkeys_enabled } = React.useContext(PlatformContext);
    const { is_passkey_supported, is_loading } = useIsPasskeySupported();
    const { ui } = useStore();
    const { is_mobile } = ui;

    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && !is_mobile;

    if (is_loading) {
        return <div>is loading</div>;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    return <h1 style={{ display: 'flex', margin: 'auto', alignItems: 'center' }}>Passkeys</h1>;
});

export default Passkeys;
