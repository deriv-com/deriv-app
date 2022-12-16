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
    verification_code,
    hasAnyRealAccount,
    openRealAccountSignup,
    setResetTradingPasswordModalOpen,
    toggleAccountSignupModal,
    toggleResetPasswordModal,
    setNewEmail,
    toggleResetEmailModal,
    toggleUpdateEmailModal,
}) => {
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    let redirected_to_route = false;
    const { is_appstore } = React.useContext(PlatformContext);
    const action_param = url_params.get('action');
    const code_param = url_params.get('code') || verification_code[action_param];

    setVerificationCode(code_param, action_param);
    setNewEmail(url_params.get('email'), action_param);

    switch (action_param) {
        case 'signup': {
            if (is_appstore) {
                // TODO: redirect
                // history.push({
                //     pathname: routes.dashboard,
                //     search: url_query_string,
                // });
                // redirected_to_route = true;
            } else {
                history.push({
                    pathname: routes.onboarding,
                    search: url_query_string,
                });
            }
            sessionStorage.removeItem('redirect_url');
            redirected_to_route = true;
            toggleAccountSignupModal(true);
            break;
        }
        case 'reset_password': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'request_email': {
            toggleResetEmailModal(true);
            break;
        }
        case 'social_email_change': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'system_email_change': {
            toggleUpdateEmailModal(true);
            break;
        }
        case 'trading_platform_mt5_password_reset':
        case 'trading_platform_dxtrade_password_reset': {
            const redirect_to = url_params.get('redirect_to');

            if (redirect_to) {
                let pathname = '';
                let hash = '';
                switch (redirect_to) {
                    case '1':
                        pathname = routes.mt5;
                        break;
                    case '10':
                        pathname = routes.mt5;
                        hash = 'real';
                        break;
                    case '11':
                        pathname = routes.mt5;
                        hash = 'demo';
                        break;
                    case '2':
                        pathname = routes.dxtrade;
                        break;
                    case '20':
                        pathname = routes.dxtrade;
                        hash = 'real';
                        break;
                    case '21':
                        pathname = routes.dxtrade;
                        hash = 'demo';
                        break;
                    case '3':
                        pathname = routes.passwords;
                        break;
                    default:
                        break;
                }

                if (pathname) {
                    history.push({
                        pathname,
                        hash,
                        search: url_query_string,
                    });
                    redirected_to_route = true;
                }
            }

            setResetTradingPasswordModalOpen(true);
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
        case 'trading_platform_investor_password_reset': {
            localStorage.setItem('cfd_reset_password_code', code_param);
            const is_demo = localStorage.getItem('cfd_reset_password_intent')?.includes('demo');
            history.push(`${routes.mt5}#${is_demo ? 'demo' : 'real'}#reset-password`);
            redirected_to_route = true;
            break;
        }
        case 'p2p_order_confirm': {
            history.push({
                pathname: routes.cashier_p2p,
                search: url_query_string,
            });
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
    currency: PropTypes.string,
    loginid: PropTypes.string,
    getServerTime: PropTypes.object,
    hasAnyRealAccount: PropTypes.bool,
    history: PropTypes.object,
    openRealAccountSignup: PropTypes.func,
    setResetTradingPasswordModalOpen: PropTypes.func,
    setVerificationCode: PropTypes.func,
    setNewEmail: PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
    toggleResetEmailModal: PropTypes.func,
    toggleUpdateEmailModal: PropTypes.func,
    verification_code: PropTypes.object,
};

export default withRouter(
    connect(({ client, ui }) => ({
        currency: client.currency,
        loginid: client.loginid,
        is_eu: client.is_eu,
        is_eu_country: client.is_eu_country,
        setVerificationCode: client.setVerificationCode,
        verification_code: client.verification_code,
        fetchResidenceList: client.fetchResidenceList,
        hasAnyRealAccount: client.hasAnyRealAccount,
        openRealAccountSignup: ui.openRealAccountSignup,
        setResetTradingPasswordModalOpen: ui.setResetTradingPasswordModalOpen,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
        setNewEmail: client.setNewEmail,
        toggleResetEmailModal: ui.toggleResetEmailModal,
        toggleUpdateEmailModal: ui.toggleUpdateEmailModal,
    }))(Redirect)
);
