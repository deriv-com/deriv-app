import React from 'react';
import { useLocation } from 'react-router-dom';
import { CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';

const ResetTradingPassword = observer(() => {
    const { ui, client } = useStore();
    const location = useLocation();
    const query_params = new URLSearchParams(location.search);
    const cfd_platform = /^trading_platform_(.*)_password_reset$/.exec(query_params.get('action') || '')?.[1];
    const [platform] = React.useState(cfd_platform);
    const verification_code =
        platform === CFD_PLATFORMS.MT5 ? client.mt5_verification_code : client.dxtrade_verification_code;

    return (
        <ResetTradingPasswordModal
            platform={platform}
            enableApp={ui.enableApp}
            disableApp={ui.disableApp}
            toggleResetTradingPasswordModal={ui.toggleResetTradingPasswordModal}
            is_visible={ui.is_visible}
            is_loading={ui.is_loading}
            verification_code={verification_code}
        />
    );
});

export default ResetTradingPassword;
