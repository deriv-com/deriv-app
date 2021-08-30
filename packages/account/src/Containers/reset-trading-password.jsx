import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { CFD_PLATFORMS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';

const ResetTradingPassword = ({
    enableApp,
    disableApp,
    toggleResetTradingPasswordModal,
    mt5_verification_code,
    dxtrade_verification_code,
    is_visible,
    is_loading,
}) => {
    const location = useLocation();
    const query_params = new URLSearchParams(location.search);
    const cfd_platform = /^trading_platform_(.*)_password_reset$/.exec(query_params.get('action') || '')?.[1];
    const [platform] = React.useState(cfd_platform);
    const verification_code = platform === CFD_PLATFORMS.MT5 ? mt5_verification_code : dxtrade_verification_code;

    return (
        <ResetTradingPasswordModal
            platform={platform}
            enableApp={enableApp}
            disableApp={disableApp}
            toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
            is_visible={is_visible}
            is_loading={is_loading}
            verification_code={verification_code}
        />
    );
};

ResetTradingPassword.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    toggleResetTradingPasswordModal: PropTypes.func,
    mt5_verification_code: PropTypes.string,
    dxtrade_verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_trading_password_modal_visible,
    toggleResetTradingPasswordModal: ui.setResetTradingPasswordModalOpen,
    mt5_verification_code: client.verification_code.trading_platform_mt5_password_reset,
    dxtrade_verification_code: client.verification_code.trading_platform_dxtrade_password_reset,
}))(ResetTradingPassword);
