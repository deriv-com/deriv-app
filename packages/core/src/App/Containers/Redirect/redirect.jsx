import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { loginUrl, routes, PlatformContext } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

const Redirect = ({
    history,
    currency,
    setVerificationCode,
    hasAnyRealAccount,
    openRealAccountSignup,
    toggleAccountSignupModal,
    toggleResetPasswordModal,
}) => {
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    let redirected_to_route = false;
    const { is_dashboard } = React.useContext(PlatformContext);

    setVerificationCode(url_params.get('code'), url_params.get('action'));

    switch (url_params.get('action')) {
        case 'signup': {
            if (is_dashboard) {
                history.push({
                    pathname: routes.dashboard,
                    search: url_query_string,
                });
                redirected_to_route = true;
            }
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
            WS.wait('get_account_status').then(() => {
                if (!currency) return openRealAccountSignup('set_currency');
                if (hasAnyRealAccount()) return openRealAccountSignup('manage');
                return openRealAccountSignup();
            });
            const ext_platform_url = url_params.get('ext_platform_url');
            if (ext_platform_url) {
                history.push(`${routes.root}?ext_platform_url=${ext_platform_url}`);
                redirected_to_route = true;
            }
            break;
        }
        case 'verification': {
            // Removing this will break mobile DP2P app. Do not remove.
            sessionStorage.setItem('redirect_url', routes.cashier_p2p_verification);
            window.location.href = loginUrl({
                language: getLanguage(),
            });
            break;
        }
        case 'mt5_password_reset': {
            localStorage.setItem('mt5_reset_password_code', url_params.get('code'));
            const is_demo = localStorage.getItem('mt5_reset_password_intent')?.includes('demo');
            history.push(`${routes.mt5}#${is_demo ? 'demo' : 'real'}#reset-password`);
            redirected_to_route = true;
            break;
        }
        default:
            break;
    }

    if (!redirected_to_route) {
        history.push({
            pathname: routes.root,
            search: url_query_string,
        });
    }

    return null;
};

Redirect.propTypes = {
    getServerTime: PropTypes.object,
    history: PropTypes.object,
    setVerificationCode: PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
};

export default withRouter(
    connect(({ client, ui }) => ({
        currency: client.currency,
        setVerificationCode: client.setVerificationCode,
        fetchResidenceList: client.fetchResidenceList,
        hasAnyRealAccount: client.hasAnyRealAccount,
        openRealAccountSignup: ui.openRealAccountSignup,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
    }))(Redirect)
);
