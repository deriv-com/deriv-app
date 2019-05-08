const BinaryPjax               = require('./binary_pjax');
const Client                   = require('./client');
const BinarySocket             = require('./socket');
const showHidePulser           = require('../common/account_opening').showHidePulser;
const MetaTrader               = require('../pages/user/metatrader/metatrader');
const GTM                      = require('../../_common/base/gtm');
const Login                    = require('../../_common/base/login');
const SocketCache              = require('../../_common/base/socket_cache');
const elementInnerHtml         = require('../../_common/common_functions').elementInnerHtml;
const elementTextContent       = require('../../_common/common_functions').elementTextContent;
const getElementById           = require('../../_common/common_functions').getElementById;
const localize                 = require('../../_common/localize').localize;
const localizeKeepPlaceholders = require('../../_common/localize').localizeKeepPlaceholders;
const State                    = require('../../_common/storage').State;
const Url                      = require('../../_common/url');
const applyToAllElements       = require('../../_common/utility').applyToAllElements;
const createElement            = require('../../_common/utility').createElement;
const findParent               = require('../../_common/utility').findParent;
const template                 = require('../../_common/utility').template;

const Header = (() => {
    const onLoad = () => {
        populateAccountsList();
        bindClick();
        if (Client.isLoggedIn()) {
            getElementById('menu-top').classList.add('smaller-font', 'top-nav-menu');
            displayAccountStatus();
            if (!Client.get('is_virtual')) {
                BinarySocket.wait('website_status', 'authorize', 'balance').then(() => {
                    if (Client.canTransferFunds()) {
                        getElementById('user_menu_account_transfer').setVisibility(1);
                    }
                });
            }
        }
    };

    const bindClick = () => {
        const logo = getElementById('logo');
        logo.removeEventListener('click', logoOnClick);
        logo.addEventListener('click', logoOnClick);

        const btn_login = getElementById('btn_login');
        btn_login.removeEventListener('click', loginOnClick);
        btn_login.addEventListener('click', loginOnClick);

        applyToAllElements('a.logout', (el) => {
            el.removeEventListener('click', logoutOnClick);
            el.addEventListener('click', logoutOnClick);
        });
    };

    const logoOnClick = () => {
        const url = Client.isLoggedIn() ? Client.defaultRedirectUrl() : Url.urlFor('');
        BinaryPjax.load(url);
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    const logoutOnClick = () => {
        Client.sendLogoutRequest();
    };

    const populateAccountsList = () => {
        if (!Client.isLoggedIn()) return;
        BinarySocket.wait('authorize').then(() => {
            const loginid_select = document.createElement('div');
            Client.getAllLoginids().forEach((loginid) => {
                if (!Client.get('is_disabled', loginid) && Client.get('token', loginid)) {
                    const account_title  = Client.getAccountTitle(loginid);
                    const is_real        = !Client.getAccountType(loginid); // this function only returns virtual/gaming/financial types
                    const currency       = Client.get('currency', loginid);
                    const localized_type = localize('[_1] Account', is_real && currency ? currency : account_title);
                    if (loginid === Client.get('loginid')) { // default account
                        applyToAllElements('.account-type', (el) => { elementInnerHtml(el, localized_type); });
                        applyToAllElements('.account-id', (el) => { elementInnerHtml(el, loginid); });
                    } else {
                        const link    = createElement('a', { href: `${'javascript:;'}`, 'data-value': loginid });
                        const li_type = createElement('li', { text: localized_type });

                        li_type.appendChild(createElement('div', { text: loginid }));
                        link.appendChild(li_type);
                        loginid_select.appendChild(link).appendChild(createElement('div', { class: 'separator-line-thin-gray' }));
                    }
                }
                applyToAllElements('.login-id-list', (el) => {
                    el.html(loginid_select.innerHTML);
                    applyToAllElements('a', (ele) => {
                        ele.removeEventListener('click', loginIDOnClick);
                        ele.addEventListener('click', loginIDOnClick);
                    }, '', el);
                });
            });
        });
    };

    const loginIDOnClick =  (e) => {
        e.preventDefault();
        const el_loginid = findParent(e.target, 'a');
        if (el_loginid) {
            el_loginid.setAttribute('disabled', 'disabled');
            switchLoginid(el_loginid.getAttribute('data-value'));
        }
    };

    const metatraderMenuItemVisibility = () => {
        BinarySocket.wait('landing_company', 'get_account_status').then(() => {
            if (MetaTrader.isEligible()) {
                const mt_visibility = document.getElementsByClassName('mt_visibility');
                applyToAllElements(mt_visibility, (el) => {
                    el.setVisibility(1);
                });
            }
        });
    };

    const switchLoginid = (loginid) => {
        if (!loginid || loginid.length === 0) return;
        const token = Client.get('token', loginid);
        if (!token || token.length === 0) {
            Client.sendLogoutRequest(true);
            return;
        }

        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag('account_switch');
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
        SocketCache.clear();
        window.location.reload();
    };

    const upgradeMessageVisibility = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings', 'get_account_status').then(() => {
            const upgrade_msg = document.getElementsByClassName('upgrademessage');

            if (!upgrade_msg) {
                return;
            }

            const showUpgrade = (url, localized_text) => {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a', (ele) => {
                        ele.html(createElement('span', { text: localized_text })).setVisibility(1).setAttribute('href', Url.urlFor(url));
                    }, '', el);
                });
            };

            const showUpgradeBtn = (url, localized_text) => {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a.button', (ele) => {
                        ele.html(createElement('span', { text: localized_text })).setVisibility(1).setAttribute('href', Url.urlFor(url));
                    }, '', el);
                });
            };

            const upgrade_info     = Client.getUpgradeInfo();
            const show_upgrade_msg = upgrade_info.can_upgrade;
            const upgrade_link_txt = upgrade_info.type === 'financial'
                ? localize('Click here to open a Financial Account')
                : localize('Click here to open a Real Account');
            const upgrade_btn_txt  = upgrade_info.type === 'financial'
                ? localize('Open a Financial Account')
                : localize('Open a Real Account');

            if (Client.get('is_virtual')) {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    const span = el.getElementsByTagName('span')[0];
                    if (span) {
                        span.setVisibility(1);
                    }
                    applyToAllElements('a', (ele) => { ele.setVisibility(0); }, '', el);
                });

                if (show_upgrade_msg) {
                    showUpgrade(upgrade_info.upgrade_link, upgrade_link_txt);
                    showUpgradeBtn(upgrade_info.upgrade_link, upgrade_btn_txt);
                } else {
                    applyToAllElements(upgrade_msg, (el) => {
                        applyToAllElements('a', (ele) => {
                            ele.setVisibility(0).innerHTML = '';
                        }, '', el);
                    });
                }
            } else if (show_upgrade_msg) {
                getElementById('virtual-wrapper').setVisibility(0);
                showUpgrade(upgrade_info.upgrade_link, upgrade_link_txt);
                showUpgradeBtn(upgrade_info.upgrade_link, upgrade_btn_txt);

                if (/new_account/.test(window.location.href)) {
                    showHidePulser(0);
                }
            } else {
                applyToAllElements(upgrade_msg, (el) => { el.setVisibility(0); });
            }
            showHideNewAccount(upgrade_info);
        });
    };

    const showHideNewAccount = (upgrade_info) => {
        if (upgrade_info.can_upgrade || upgrade_info.can_open_multi) {
            changeAccountsText(1, localize('Create Account'));
        } else {
            changeAccountsText(0, localize('Accounts List'));
        }
    };

    const changeAccountsText = (add_new_style, localized_text) => {
        const user_accounts = getElementById('user_accounts');
        user_accounts.classList[add_new_style ? 'add' : 'remove']('create_new_account');
        applyToAllElements('li', (el) => { elementTextContent(el, localized_text); }, '', user_accounts);
    };

    const displayNotification = (message, is_error = false, msg_code = '') => {
        const msg_notification = getElementById('msg_notification');
        if (msg_notification.getAttribute('data-code') === 'STORAGE_NOT_SUPPORTED') return;

        msg_notification.html(message);
        msg_notification.setAttribute('data-message', message);
        msg_notification.setAttribute('data-code', msg_code);

        if (msg_notification.offsetParent) {
            msg_notification.toggleClass('error', is_error);
        } else {
            $(msg_notification).slideDown(500, () => { if (is_error) msg_notification.classList.add('error'); });
        }
    };

    const hideNotification = (msg_code) => {
        const msg_notification = getElementById('msg_notification');
        if (/^(STORAGE_NOT_SUPPORTED|MFSA_MESSAGE)$/.test(msg_notification.getAttribute('data-code')) ||
            msg_code && msg_notification.getAttribute('data-code') !== msg_code) {
            return;
        }

        if (msg_notification.offsetParent) {
            msg_notification.classList.remove('error');
            $(msg_notification).slideUp(500, () => {
                elementInnerHtml(msg_notification, '');
                msg_notification.removeAttribute('data-message data-code');
            });
        }
    };

    const displayAccountStatus = () => {
        BinarySocket.wait('authorize', 'landing_company').then(() => {
            let get_account_status,
                status;
            // TODO [->svg]
            const is_svg = Client.get('landing_company_shortcode') === 'costarica' || Client.get('landing_company_shortcode') === 'svg';
            const necessary_withdrawal_fields = is_svg
                ? State.getResponse('landing_company.financial_company.requirements.withdrawal')
                : [];
            const necessary_signup_fields = is_svg
                ? State.getResponse('landing_company.financial_company.requirements.signup')
                    .map(field => (field === 'residence' ? 'country' : field))
                : [];

            const hasMissingRequiredField = () => {
                // eslint-disable-next-line no-nested-ternary
                const required_fields = is_svg ? [ ...necessary_signup_fields, ...necessary_withdrawal_fields ]
                    : Client.isAccountOfType('financial') ? [
                        'account_opening_reason',
                        'address_line_1',
                        'address_city',
                        'phone',
                        'tax_identification_number',
                        'tax_residence',
                        ...(Client.get('residence') === 'gb' || Client.get('landing_company_shortcode') === 'iom' ? ['address_postcode'] : []),
                    ] : [];
                
                const get_settings = State.getResponse('get_settings');
                return required_fields.some(field => !get_settings[field]);
            };

            const buildMessage = (string, path, hash = '') => template(string, [`<a href="${Url.urlFor(path)}${hash}">`, '</a>']);
            const hasStatus = (string) => status.findIndex(s => s === string) < 0 ? Boolean(false) : Boolean(true);

            const has_no_tnc_limit = is_svg;

            const messages = {
                authenticate         : () => buildMessage(localizeKeepPlaceholders('[_1]Authenticate your account[_2] now to take full advantage of all payment methods available.'),                                      'user/authenticate'),
                cashier_locked       : () => localize('Deposits and withdrawals have been disabled on your account. Please check your email for more details.'),
                currency             : () => buildMessage(localizeKeepPlaceholders('Please set the [_1]currency[_2] of your account.'),                                                                                    'user/set-currency'),
                document_needs_action: () => buildMessage(localizeKeepPlaceholders('[_1]Your Proof of Identity or Proof of Address[_2] did not meet our requirements. Please check your email for further instructions.'), 'user/authenticate'),
                document_review      : () => buildMessage(localizeKeepPlaceholders('We are reviewing your documents. For more details [_1]contact us[_2].'),                                                               'contact'),
                excluded_until       : () => buildMessage(localizeKeepPlaceholders('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.'),                                                 'contact'),
                financial_limit      : () => buildMessage(localizeKeepPlaceholders('Please set your [_1]30-day turnover limit[_2] to remove deposit limits.'),                                                             'user/security/self_exclusionws'),
                mf_retail            : () => buildMessage(localizeKeepPlaceholders('Binary Options Trading has been disabled on your account. Kindly [_1]contact customer support[_2] for assistance.'),                   'contact'),
                mt5_withdrawal_locked: () => localize('MT5 withdrawals have been disabled on your account. Please check your email for more details.'),
                required_fields      : () => buildMessage(localizeKeepPlaceholders('Please complete your [_1]personal details[_2] before you proceed.'),                                                                   'user/settings/detailsws'),
                residence            : () => buildMessage(localizeKeepPlaceholders('Please set [_1]country of residence[_2] before upgrading to a real-money account.'),                                                   'user/settings/detailsws'),
                risk                 : () => buildMessage(localizeKeepPlaceholders('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.'),                                   'user/settings/assessmentws'),
                tax                  : () => buildMessage(localizeKeepPlaceholders('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.'),                                            'user/settings/detailsws'),
                unwelcome            : () => buildMessage(localizeKeepPlaceholders('Trading and deposits have been disabled on your account. Kindly [_1]contact customer support[_2] for assistance.'),                    'contact'),
                withdrawal_locked    : () => localize('Withdrawals have been disabled on your account. Please check your email for more details.'),
                tnc                  : () => buildMessage(has_no_tnc_limit
                    ? localizeKeepPlaceholders('Please [_1]accept the updated Terms and Conditions[_2].')
                    : localizeKeepPlaceholders('Please [_1]accept the updated Terms and Conditions[_2] to lift your deposit and trading limits.'), 'user/tnc_approvalws'),
            };

            const validations = {
                authenticate         : () => +get_account_status.prompt_client_to_authenticate,
                cashier_locked       : () => hasStatus('cashier_locked'),
                currency             : () => !Client.get('currency'),
                document_needs_action: () => hasStatus('document_needs_action'),
                document_review      : () => hasStatus('document_under_review'),
                excluded_until       : () => Client.get('excluded_until'),
                financial_limit      : () => hasStatus('ukrts_max_turnover_limit_not_set'),
                mf_retail            : () => Client.get('landing_company_shortcode') === 'maltainvest' && !hasStatus('professional'),
                mt5_withdrawal_locked: () => hasStatus('mt5_withdrawal_locked'),
                required_fields      : () => hasMissingRequiredField(),
                residence            : () => !Client.get('residence'),
                risk                 : () => Client.getRiskAssessment(),
                tax                  : () => Client.shouldCompleteTax(),
                tnc                  : () => Client.shouldAcceptTnc(),
                unwelcome            : () => hasStatus('unwelcome'),
                withdrawal_locked    : () => hasStatus('withdrawal_locked'),
            };

            // real account checks in order
            const check_statuses_real = [
                'excluded_until',
                'tnc',
                'required_fields',
                'financial_limit',
                'risk',
                'tax',
                'currency',
                'document_review',
                'document_needs_action',
                'authenticate',
                'cashier_locked',
                'withdrawal_locked',
                'mt5_withdrawal_locked',
                'unwelcome',
                'mf_retail',
            ];

            // virtual checks
            const check_statuses_virtual = [
                'residence',
            ];

            const checkStatus = (check_statuses) => {
                const notified = check_statuses.some((check_type) => {
                    if (validations[check_type]()) {
                        // show MF retail message on Trading pages only
                        if (check_type === 'mf_retail' && !(State.get('is_trading') || State.get('is_mb_trading'))) {
                            return false;
                        }
                        displayNotification(messages[check_type](), false, check_type === 'mf_retail' ? 'MF_RETAIL_MESSAGE' : '');
                        return true;
                    }
                    return false;
                });
                if (!notified) hideNotification();
            };

            if (Client.get('is_virtual')) {
                checkStatus(check_statuses_virtual);
            } else {
                const el_account_status = createElement('span', { class: 'authenticated', 'data-balloon': localize('Account Authenticated'), 'data-balloon-pos': 'down' });

                BinarySocket.wait('website_status', 'get_account_status', 'get_settings', 'balance').then(() => {
                    get_account_status = State.getResponse('get_account_status') || {};
                    status             = get_account_status.status;
                    checkStatus(check_statuses_real);
                    const is_fully_authenticated = hasStatus('authenticated') && !+get_account_status.prompt_client_to_authenticate;
                    $('.account-id')[is_fully_authenticated ? 'append' : 'remove'](el_account_status);
                });
            }
        });
    };

    return {
        onLoad,
        populateAccountsList,
        upgradeMessageVisibility,
        metatraderMenuItemVisibility,
        displayNotification,
        hideNotification,
        displayAccountStatus,
        loginOnClick,
    };
})();

module.exports = Header;
