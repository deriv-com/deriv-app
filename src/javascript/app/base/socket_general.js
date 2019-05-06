const Cookies                = require('js-cookie');
const Client                 = require('./client');
const Clock                  = require('./clock');
const Footer                 = require('./footer');
const Header                 = require('./header');
const BinarySocket           = require('./socket');
const Dialog                 = require('../common/attach_dom/dialog');
const createLanguageDropDown = require('../common/attach_dom/language_dropdown');
const showPopup              = require('../common/attach_dom/popup');
const setCurrencies          = require('../common/currency').setCurrencies;
const SessionDurationLimit   = require('../common/session_duration_limit');
const updateBalance          = require('../pages/user/update_balance');
const GTM                    = require('../../_common/base/gtm');
const Login                  = require('../../_common/base/login');
const SubscriptionManager    = require('../../_common/base/subscription_manager').default;
const Crowdin                = require('../../_common/crowdin');
const localize               = require('../../_common/localize').localize;
const LocalStore             = require('../../_common/storage').LocalStore;
const State                  = require('../../_common/storage').State;
const urlFor                 = require('../../_common/url').urlFor;
const getPropertyValue       = require('../../_common/utility').getPropertyValue;

const BinarySocketGeneral = (() => {
    const onOpen = (is_ready) => {
        Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                if (!Client.isValidLoginid()) {
                    Client.sendLogoutRequest();
                    return;
                }
                BinarySocket.send({ website_status: 1, subscribe: 1 });
            }
            Clock.startClock();
        }
    };

    const onMessage = (response) => {
        handleError(response);
        Header.hideNotification('CONNECTION_ERROR');
        let is_available = false;
        switch (response.msg_type) {
            case 'website_status':
                if (response.website_status) {
                    is_available = /^up$/i.test(response.website_status.site_status);
                    if (is_available && !BinarySocket.availability()) {
                        window.location.reload();
                        return;
                    }
                    if (!Crowdin.isInContext()) {
                        createLanguageDropDown(response.website_status);
                    }
                    if (response.website_status.message) {
                        Footer.displayNotification(response.website_status.message);
                    } else {
                        Footer.clearNotification();
                    }
                    BinarySocket.availability(is_available);
                    setCurrencies(response.website_status);
                    // for logged out clients send landing company with IP address as residence
                    if (!Client.isLoggedIn() && !State.getResponse('landing_company')) {
                        BinarySocket.send({ landing_company: response.website_status.clients_country });
                    }
                    if (!Client.isLoggedIn() && !Cookies.get('CookieConsent')) {
                        Footer.displayDialogMessage();
                    } else {
                        Footer.clearDialogMessage();
                    }
                }
                break;
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        Dialog.alert({ id: 'authorize_error_alert', localized_message: response.error.message });
                    }
                    Client.sendLogoutRequest(is_active_tab);
                } else if (!Login.isLoginPages() && !/authorize/.test(State.get('skip_response'))) {
                    if (response.authorize.loginid !== Client.get('loginid')) {
                        Client.sendLogoutRequest(true);
                    } else {
                        Client.responseAuthorize(response);
                        BinarySocket.send({ balance: 1, subscribe: 1 });
                        BinarySocket.send({ get_settings: 1 });
                        BinarySocket.send({ get_account_status: 1 });
                        BinarySocket.send({ payout_currencies: 1 });
                        BinarySocket.send({ mt5_login_list: 1 });
                        SubscriptionManager.subscribe('transaction', { transaction: 1, subscribe: 1 }, () => false);
                        const clients_country = response.authorize.country || Client.get('residence');
                        setResidence(clients_country);
                        // for logged in clients send landing company with IP address as residence
                        if (!clients_country) {
                            BinarySocket.send({ landing_company: State.getResponse('website_status.clients_country') });
                        }
                        if (!Client.get('is_virtual')) {
                            BinarySocket.send({ get_self_exclusion: 1 });
                        }
                        BinarySocket.sendBuffered();
                        if (/bch/i.test(response.authorize.currency) && !Client.get('accepted_bch')) {
                            showPopup({
                                url        : urlFor('user/warning'),
                                popup_id   : 'warning_popup',
                                form_id    : '#frm_warning',
                                content_id : '#warning_content',
                                validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
                                onAccept   : () => { Client.set('accepted_bch', 1); },
                            });
                        }
                        LocalStore.remove('date_first_contact');
                        LocalStore.remove('signup_device');
                    }
                }
                break;
            case 'balance':
                updateBalance(response);
                break;
            case 'logout':
                Client.doLogout(response);
                break;
            case 'landing_company':
                Header.upgradeMessageVisibility();
                if (!response.error) {
                    Header.metatraderMenuItemVisibility();
                }
                break;
            case 'get_self_exclusion':
                SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    Client.set('email', response.get_settings.email);
                    GTM.eventHandler(response.get_settings);
                    if (response.get_settings.is_authenticated_payment_agent) {
                        $('#topMenuPaymentAgent').setVisibility(1);
                    }
                }
                break;
            case 'transaction':
                GTM.pushTransactionData(response, { bom_ui: 'new' });
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            Client.set('residence', residence);
            BinarySocket.send({ landing_company: residence });
        }
    };

    const handleError = (response) => {
        const msg_type   = response.msg_type;
        const error_code = getPropertyValue(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
            case 'InternalServerError':
            case 'OutputValidationFailed': {
                if (msg_type !== 'mt5_login_list') {
                    showNoticeMessage(response.error.message);
                }
                break;
            }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    Header.displayNotification(localize('You have reached the rate limit of requests per second. Please try later.'), true, 'RATE_LIMIT');
                }
                break;
            case 'InvalidAppID':
                Header.displayNotification(response.error.message, true, 'INVALID_APP_ID');
                break;
            case 'DisabledClient':
                showNoticeMessage(response.error.message);
                break;
            // no default
        }
    };

    const showNoticeMessage = (text) => {
        $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text })));
    };

    return {
        onOpen,
        onMessage,
    };
})();

module.exports = BinarySocketGeneral;
