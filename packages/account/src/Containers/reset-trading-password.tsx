import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';
import { TPlatforms } from '../Types';

const ResetTradingPassword = observer(() => {
    const { ui, client } = useStore();
    const { enableApp, disableApp, is_loading, setCFDPasswordResetModal, is_cfd_reset_password_modal_enabled } = ui;
    const location = useLocation();
    const platform = useRef('');
    const query_params = new URLSearchParams(location.search);
    const cfd_platform = /^trading_platform_(.*)_password_reset$/.exec(query_params.get('action') ?? '')?.[1];
    if (cfd_platform) {
        /**
         * Keep the platform value reference to avoid value loss when modal re-renders due to route re-direction
         */
        platform.current = cfd_platform;
    }

    const verification_code =
        platform.current === CFD_PLATFORMS.MT5
            ? client.verification_code.trading_platform_mt5_password_reset
            : client.verification_code.trading_platform_dxtrade_password_reset;

    return (
        <ResetTradingPasswordModal
            platform={platform.current as TPlatforms}
            enableApp={enableApp}
            disableApp={disableApp}
            toggleResetTradingPasswordModal={setCFDPasswordResetModal}
            is_visible={is_cfd_reset_password_modal_enabled}
            is_loading={is_loading}
            verification_code={verification_code}
        />
    );
});

ResetTradingPassword.displayName = 'ResetTradingPassword';

export default ResetTradingPassword;
