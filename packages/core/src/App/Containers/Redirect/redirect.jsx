import PropTypes      from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect }    from 'Stores/connect';
import routes         from '../../../Constants/routes';

const Redirect = ({
    history,
    setCashierActiveTab,
    setDeviceData,
    setVerificationCode,
    toggleAccountSignupModal,
    toggleCashierModal,
    toggleResetPasswordModal,
}) => {
    const url_params = new URLSearchParams(window.location.search);

    setVerificationCode(url_params.get('code'), url_params.get('action'));

    switch (url_params.get('action')) {
        case 'signup': {
            const device_data = {
                affiliate_token   : url_params.get('affiliate_token') || '',
                date_first_contact: url_params.get('date_first_contact') || '',
                gclid_url         : url_params.get('gclid_url') || '',
                signup_device     : url_params.get('signup_device') || '',
                utm_campaign      : url_params.get('utm_campaign') || '',
                utm_medium        : url_params.get('utm_medium') || '',
                utm_source        : url_params.get('utm_source') || '',
            };

            setDeviceData(device_data);
            toggleAccountSignupModal(true);
            break;
        }
        case 'reset_password': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'payment_withdraw': {
            setCashierActiveTab('withdraw');
            toggleCashierModal();
            break;
        }
        case 'payment_agent_withdraw': {
            setCashierActiveTab('payment_agent');
            toggleCashierModal();
            break;
        }
        default: break;
    }

    // Clear URL search params and route to root (currently set to `trade`)
    window.history.replaceState({}, document.title, '/');
    history.push(routes.root);

    return null;
};

Redirect.propTypes = {
    history                 : PropTypes.object,
    setDeviceData           : PropTypes.func,
    setVerificationCode     : PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleCashierModal      : PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
};

export default withRouter(connect(
    ({ client, ui }) => ({
        setCashierActiveTab     : ui.setCashierActiveTab,
        setDeviceData           : client.setDeviceData,
        setVerificationCode     : client.setVerificationCode,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleCashierModal      : ui.toggleCashierModal,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
    }),
)(Redirect));
