import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';

const ResetTradingPassword = ({
    enableApp,
    disableApp,
    toggleResetTradingPasswordModal,
    verification_code,
    is_visible,
    is_loading,
    is_dxtrade_allowed,
}) => {
    return (
        <ResetTradingPasswordModal
            platform={'mt5'}
            enableApp={enableApp}
            disableApp={disableApp}
            toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
            is_visible={is_visible}
            is_loading={is_loading}
            verification_code={verification_code}
            is_dxtrade_allowed={is_dxtrade_allowed}
        />
    );
};

ResetTradingPassword.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_trading_password_modal_visible,
    toggleResetTradingPasswordModal: ui.setResetTradingPasswordModalOpen,
    verification_code: client.verification_code.trading_platform_password_reset,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
}))(ResetTradingPassword);
