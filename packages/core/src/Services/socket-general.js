import { action, flow }  from 'mobx';
import ObjectUtils       from 'deriv-shared/utils/object';
import Login             from '_common/base/login';
import ServerTime        from '_common/base/server_time';
import BinarySocket      from '_common/base/socket_base';
import { State }         from '_common/storage';
import { localize }      from 'deriv-translations';
import WS                from './ws-methods';

let client_store,
    common_store,
    gtm_store;

// TODO: update commented statements to the corresponding functions from app
const BinarySocketGeneral = (() => {
    const onDisconnect = () => {
        common_store.setIsSocketOpened(false);
    };

    const onOpen = (is_ready) => {
        // Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                if (!client_store.is_valid_login) {
                    client_store.logout();
                    return;
                }
                WS.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
            }
            ServerTime.init(action('setTime', () => { common_store.server_time = ServerTime.get(); }));
            common_store.setIsSocketOpened(true);
        }
    };

    const onMessage = (response) => {
        handleError(response);
        // Header.hideNotification('CONNECTION_ERROR');
        switch (response.msg_type) {
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (ObjectUtils.getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        // Dialog.alert({ id: 'authorize_error_alert', message: response.error.message });
                    }
                    client_store.logout();
                } else if (!Login.isLoginPages() && !/authorize/.test(State.get('skip_response'))) {
                    // is_populating_account_list is a check to avoid logout on the first logged-in session
                    // In any other case, if the response loginid does not match the store's loginid, user must be logged out
                    if (response.authorize.loginid !== client_store.loginid &&
                        !client_store.is_populating_account_list) {
                        client_store.logout();
                    } else if (response.authorize.loginid === client_store.loginid) {
                        // All other cases continue with the loginid and authorize the profile
                        authorizeAccount(response);
                    }
                }
                break;
            case 'landing_company':
                // Header.upgradeMessageVisibility();
                break;
            case 'get_self_exclusion':
                // SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    client_store.setEmail(response.get_settings.email);
                    client_store.setAccountSettings(response.get_settings);
                    gtm_store.eventHandler(response.get_settings);
                }
                break;
            case 'get_account_status':
                client_store.setAccountStatus(response.get_account_status);
                break;
            case 'payout_currencies':
                client_store.responsePayoutCurrencies(response.payout_currencies);
                break;
            case 'transaction':
                gtm_store.pushTransactionData(response);
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            client_store.setResidence(residence);
            WS.landingCompany(residence);
        }
    };

    const setBalance = flow(function* (obj_balance) {
        yield BinarySocket.wait('website_status');
        client_store.setBalance(obj_balance);
    });

    const handleError = (response) => {
        const msg_type   = response.msg_type;
        const error_code = ObjectUtils.getPropertyValue(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
                // TODO: Remove condition checks below for WrongResponse once mt5 is more reliable
                if (msg_type === 'mt5_login_list') {
                    WS.authorized.mt5LoginList().then((mt5_list_response) => {
                        if (!mt5_list_response.error) {
                            client_store.responseMt5LoginList(mt5_list_response);
                            WS.balanceAll().then((balance_response) => {
                                this.setBalance(balance_response.balance);
                            });
                        } else {
                            client_store.resetMt5ListPopulatedState();
                        }
                    });
                } else if (msg_type === 'balance') {
                    forgetAndSubscribeBalance();
                } else if (msg_type === 'get_account_status') {
                    WS.authorized.getAccountStatus().then((account_status_response) => {
                        if (!account_status_response.error) {
                            client_store.setAccountStatus(account_status_response.get_account_status);
                        }
                    });
                }
                break;
            case 'InternalServerError':
            case 'OutputValidationFailed': {
                if (msg_type !== 'mt5_login_list') {
                    common_store.setError(true, { message: response.error.message });
                }
                break;
            }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    common_store.setError(true, { message: localize('You have reached the rate limit of requests per second. Please try later.') });
                }
                break;
            case 'InvalidAppID':
                common_store.setError(true, { message: response.error.message });
                break;
            case 'DisabledClient':
                common_store.setError(true, { message: response.error.message });
                break;
            case 'InvalidToken':
                // if message type equals to cashier, there is no need to logout user
                if (msg_type === 'cashier' || msg_type === 'paymentagent_withdraw') {
                    return;
                }
                client_store.logout().then(() => {
                    common_store.setError(true, {
                        header             : response.error.message,
                        message            : localize('Please Log in'),
                        should_show_refresh: false,
                        redirect_label     : localize('Log in'),
                        redirectOnClick    : Login.redirectToLogin,
                    });
                });
            // no default
        }
    };

    const init = (store) => {
        client_store = store.client;
        common_store = store.common;
        gtm_store    = store.gtm;

        return {
            onDisconnect,
            onOpen,
            onMessage,
        };
    };

    const forgetAndSubscribeBalance = () => {
        WS.forgetAll('balance').then(() => {
            // the first has to be without subscribe to quickly update current account's balance
            WS.authorized.balance().then(ResponseHandlers.balance);
            // the second is to subscribe to balance and update all sibling accounts' balances too
            WS.subscribeBalanceAll(ResponseHandlers.balance);
        });
    };

    const authorizeAccount = (response) => {
        client_store.responseAuthorize(response);
        forgetAndSubscribeBalance();
        WS.getSettings();
        WS.getAccountStatus();
        WS.storage.payoutCurrencies();
        WS.mt5LoginList();
        setResidence(
            response.authorize.country ||
            client_store.accounts[client_store.loginid].residence
        );
        if (!client_store.is_virtual) {
            WS.getSelfExclusion();
        }
        BinarySocket.sendBuffered();
        if (/bch/i.test(response.authorize.currency) && !client_store.accounts[client_store.loginid].accepted_bch) {
            // showPopup({
            //     url        : urlFor('user/warning'),
            //     popup_id   : 'warning_popup',
            //     form_id    : '#frm_warning',
            //     content_id : '#warning_content',
            //     validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
            //     onAccept   : () => { Client.set('accepted_bch', 1); },
            // });
        }
    };

    return {
        init,
        setBalance,
        authorizeAccount,
    };
})();

export default BinarySocketGeneral;

const ResponseHandlers = (() => {
    let is_available = false;
    const websiteStatus = (response) => {
        if (response.website_status) {
            is_available = /^up$/i.test(response.website_status.site_status);
            if (is_available && !BinarySocket.availability()) {
                window.location.reload();
                return;
            }
            if (response.website_status.message) {
                // Footer.displayNotification(response.website_status.message);
            } else {
                // Footer.clearNotification();
            }
            BinarySocket.availability(is_available);
            client_store.setWebsiteStatus(response);
        }
    };

    const balance = (response) => {
        if (!response.error){
            BinarySocketGeneral.setBalance(response.balance);
        }
    };

    return {
        websiteStatus,
        balance,
    };
})();
