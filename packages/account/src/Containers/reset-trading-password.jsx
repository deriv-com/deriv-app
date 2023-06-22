import React from 'react';
import { useLocation } from 'react-router-dom';
import { CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';

const ResetTradingPassword = observer(() => {
    const { ui, client } = useStore();
    const { enableApp, disableApp, is_visible, is_loading, setResetTradingPasswordModalOpen } = ui;
    const location = useLocation();
    const query_params = new URLSearchParams(location.search);
    const cfd_platform = /^trading_platform_(.*)_password_reset$/.exec(query_params.get('action') || '')?.[1];
    const [platform] = React.useState(cfd_platform);
    const verification_code =
        platform === CFD_PLATFORMS.MT5
            ? client.verification_code.trading_platform_mt5_password_reset
            : client.verification_code.trading_platform_dxtrade_password_reset;

    return (
        <ResetTradingPasswordModal
            platform={platform}
            enableApp={enableApp}
            disableApp={disableApp}
            toggleResetTradingPasswordModal={setResetTradingPasswordModalOpen}
            is_visible={is_visible}
            is_loading={is_loading}
            verification_code={verification_code}
        />
    );
});

export default ResetTradingPassword;
