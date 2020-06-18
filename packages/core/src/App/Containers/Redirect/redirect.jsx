import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import routes from '@deriv/shared/utils/routes';
import { isDesktop } from '@deriv/shared/utils/os';
import { connect } from 'Stores/connect';
import Login from '_common/base/login';

const Redirect = ({
    server_time,
    history,
    setDeviceData,
    setVerificationCode,
    fetchResidenceList,
    openRealAccountSignup,
    toggleAccountSignupModal,
    toggleResetPasswordModal,
}) => {
    const url_params = new URLSearchParams(window.location.search);
    let redirected_to_route = false;

    setVerificationCode(url_params.get('code'), url_params.get('action'));

    switch (url_params.get('action')) {
        case 'signup': {
            const device_data = {
                affiliate_token: url_params.get('affiliate_token') || '',
                date_first_contact: url_params.get('date_first_contact') || server_time.format('YYYY-MM-DD'),
                gclid_url: url_params.get('gclid_url') || '',
                signup_device: url_params.get('signup_device') || isDesktop() ? 'desktop' : 'mobile',
                utm_campaign: url_params.get('utm_campaign') || '',
                utm_medium: url_params.get('utm_medium') || '',
                utm_source: url_params.get('utm_source') || '',
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
            history.push(routes.cashier_withdrawal);
            redirected_to_route = true;
            break;
        }
        case 'payment_agent_withdraw': {
            history.push(routes.cashier_pa);
            redirected_to_route = true;
            break;
        }
        case 'add_account': {
            fetchResidenceList().then(openRealAccountSignup);

            const ext_platform_url = url_params.get('ext_platform_url');
            if (ext_platform_url) {
                history.push(`${routes.root}?ext_platform_url=${ext_platform_url}`);
                redirected_to_route = true;
            }
            break;
        }
        case 'document_verification': {
            sessionStorage.setItem('redirect_url', routes.proof_of_identity);
            window.location.href = Login.loginUrl();
            return null;
        }
        case 'verification': {
            sessionStorage.setItem('redirect_url', `${routes.cashier_p2p}#verification`);
            window.location.href = Login.loginUrl();
            break;
        }
        case 'mt5_password_reset':
            history.push(`${routes.mt5}?code=${url_params.get('code')}#reset-password`);
            redirected_to_route = true;
            break;
        default:
            break;
    }

    if (!redirected_to_route) {
        // Clear URL search params and route to root (currently set to `trade`)
        window.history.replaceState({}, document.title, '/');
        history.push(routes.root);
    }

    return null;
};

Redirect.propTypes = {
    getServerTime: PropTypes.object,
    history: PropTypes.object,
    setDeviceData: PropTypes.func,
    setVerificationCode: PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
};

export default withRouter(
    connect(({ client, ui, common }) => ({
        setDeviceData: client.setDeviceData,
        setVerificationCode: client.setVerificationCode,
        fetchResidenceList: client.fetchResidenceList,
        server_time: common.server_time,
        openRealAccountSignup: ui.openRealAccountSignup,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
    }))(Redirect)
);
