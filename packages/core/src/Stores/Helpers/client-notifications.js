import React from 'react';
import {
    formatDate,
    getStaticUrl,
    getUrlBase,
    isCryptocurrency,
    isEmptyObject,
    isMobile,
    LocalStore,
    routes,
    State,
    platform_name,
} from '@deriv/shared';
import { StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import { WS } from 'Services';

// TODO: Update links to app_2 links when components are done.
/* eslint-disable react/jsx-no-target-blank */
export const clientNotifications = (ui = {}, client = {}) => {
    const notifications = {
        dp2p: {
            key: 'dp2p',
            header: localize('Payment problems?'),
            message: localize('There’s an app for that'),
            primary_btn: {
                text: localize('Learn more'),
                onClick: () => {
                    window.open(getStaticUrl('/p2p/v1'), '_blank');
                },
            },
            secondary_btn: { text: localize('Skip') },
            img_src: getUrlBase('/public/images/common/dp2p_banner.png'),
            img_alt: 'DP2P',
            type: 'news',
        },
        currency: {
            key: 'currency',
            header: localize('Set account currency'),
            message: localize('Please set your account currency to enable deposits and withdrawals.'),
            type: 'danger',
        },
        self_exclusion: excluded_until => {
            return {
                key: 'self_exclusion',
                header: localize('Self-exclusion detected'),
                message: (
                    <Localize
                        i18n_default_text='You have chosen to exclude yourself from trading on our website until {{exclusion_end}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.'
                        values={{
                            exclusion_end: formatDate(excluded_until, 'DD MMM, YYYY'),
                            interpolation: { escapeValue: false },
                        }}
                    />
                ),
                type: 'danger',
            }
        },
        cashier_locked: {
            key: 'cashier_locked',
            header: localize('Cashier disabled'),
            message: localize(
                'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
            ),
            type: 'warning',
        },
        system_maintenance: (withdrawal_locked, deposit_locked) => {
            let message, header;
            if (isCryptocurrency(client.currency)) {
                if (withdrawal_locked) {
                    header = localize('Withdrawals are locked');
                    message = localize('Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.');
                } else if (deposit_locked) {
                    header = localize('Deposits are locked');
                    message = localize('Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.');
                } else {
                    header = localize('Cashier is locked');
                    message = localize('Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.');
                }
            } else {
                header = localize('Cashier is locked');
                message = localize('Our cashier is temporarily down due to system maintenance.You can access the Cashier in a few minutes when the maintenance is complete.');
            }
            return {
                key: 'system_maintenance',
                header,
                message,
                type: 'warning',
            };
        },
        authenticate: {
            key: 'authenticate',
            header: localize('Withdrawal disabled'),
            message: (
                <Localize
                    i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your cashier.'
                    components={[<BinaryLink key={0} className='link' to={routes.proof_of_identity} />,
                        <BinaryLink key={1} className='link' to={routes.proof_of_address} />
                    ]}
                />
            ),
            type: 'warning',
        },
        withdrawal_locked_review: {
            key: 'withdrawal_locked_review',
            header: localize('Withdrawal disabled'),
            message: localize(
                'Your account has not been authenticated. Please submit your proof of identity and proof of address to authenticate your account and request for withdrawals.'
            ),
            type: 'warning',
        },
        no_withdrawal_or_trading: {
            key: 'no_withdrawal_or_trading',
            header: localize('Withdrawal disabled'),
            message: localize(
                'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
            ),
            type: 'warning',
        },
        withdrawal_locked: {
            key: 'withdrawal_locked',
            header: localize('Withdrawal disabled'),
            message: localize(
                'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
            ),
            type: 'warning',
        },
        mt5_withdrawal_locked: {
            key: 'mt5_withdrawal_locked',
            header: localize('MT5 withdrawal disabled'),
            message: localize(
                'MT5 withdrawals have been disabled on your account. Please check your email for more details.'
            ),
            type: 'warning',
        },
        ask_financial_risk_approval: {
            key: 'ask_financial_risk_approval',
            header: localize('Cashier is locked'),
            message: localize(
                'Please complete the Appropriateness Test to access your cashier.'
            ),
            type: 'warning',
        },
        document_needs_action: {
            key: 'document_needs_action',
            header: localize('Authentication failed'),
            message: (
                <Localize
                    i18n_default_text='<0>Your Proof of Identity or Proof of Address</0> did not meet our requirements. Please check your email for further instructions.'
                    components={[<BinaryLink key={0} className='link' to={routes.proof_of_identity} />]}
                />
            ),
            type: 'warning',
        },
        unwelcome: {
            key: 'unwelcome',
            header: localize('Trading and deposits disabled'),
            message: (
                <Localize i18n_default_text='Unfortunately, you can only make withdrawals. Please contact us via live chat to enable deposits.' />
            ),
            type: 'danger',
        },
        max_turnover_limit_not_set: {
            key: 'max_turnover_limit_not_set',
            header: localize('Remove deposit limits'),
            message: (
                <Localize
                    i18n_default_text='Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                    components={[<BinaryLink key={0} className='link' to={routes.self_exclusion} />]}
                />
            ),
            type: 'danger',
        },
        risk: {
            key: 'risk',
            header: localize('Withdrawal and trading limits'),
            message: (
                <Localize
                    i18n_default_text='Your cashier is locked. Please complete the <0>financial assessment</0> to unlock it.'
                    components={[<BinaryLink key={0} className='link' to={routes.financial_assessment} />]}
                />
            ),
            type: 'warning',
        },
        tax: {
            key: 'tax',
            header: localize('Complete your personal details'),
            message: (
                <Localize
                    i18n_default_text='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings, and fill in your latest tax identification number.'
                    components={[<BinaryLink key={0} className='link' to={routes.personal_details} />]}
                />
            ),
            type: 'danger',
        },
        tnc: {
            action: {
                onClick: async () => {
                    await WS.tncApproval();
                    WS.getSettings();
                },
                text: localize('I accept'),
            },
            key: 'tnc',
            header: localize('Terms & conditions updated'),
            message: (
                <Localize
                    i18n_default_text='Please accept our <0>updated Terms and Conditions</0> to proceed.'
                    components={[<StaticUrl key={0} className='link' href='terms-and-conditions' />]}
                />
            ),
            type: 'warning',
        },
        required_fields: (withdrawal_locked, deposit_locked) => {
            let message, header;
            if (withdrawal_locked) {
                header = localize('Withdrawals are locked');
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            } else if (deposit_locked) {
                header = localize('Deposits are locked');
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable deposits.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            } else {
                header = localize('Cashier is locked');
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            }
            return {
                key: 'required_fields',
                header,
                message,
                type: 'danger',
            };
        },
        you_are_offline: {
            key: 'you_are_offline',
            header: localize('You are offline'),
            message: <Localize i18n_default_text='Check your connection.' />,
            type: 'danger',
        },
        password_changed: {
            key: 'password_changed',
            header: localize('Password updated.'),
            message: <Localize i18n_default_text='Please log in with your updated password.' />,
            type: 'info',
        },
        reset_virtual_balance: {
            key: 'reset_virtual_balance',
            header: localize('Reset your balance'),
            message: client.message,
            type: 'info',
            is_persistent: true,
            should_show_again: true,
            platform: [platform_name.DTrader],
            is_disposable: true,
            action: {
                text: localize('Reset balance'),
                onClick: async () => {
                    await client.resetVirtualBalance();
                },
            },
        },
        needs_poi: {
            action: {
                route: routes.proof_of_identity,
                text: localize('Verify identity'),
            },
            key: 'needs_poi',
            header: localize('Please verify your proof of identity'),
            message: localize('To continue trading with us, please confirm who you are.'),
            type: 'danger',
        },
        needs_poa: {
            action: {
                route: routes.proof_of_address,
                text: localize('Verify address'),
            },
            key: 'needs_poa',
            header: localize('Please verify your proof of address'),
            message: localize('To continue trading with us, please confirm where you live.'),
            type: 'danger',
        },
        needs_poi_virtual: {
            action: {
                onClick: async () => {
                    const { switchAccount, first_switchable_real_loginid } = client;

                    await switchAccount(first_switchable_real_loginid);
                },
                text: localize('Verify identity'),
            },
            key: 'needs_poi_virtual',
            header: localize('Please Verify your identity'),
            message: localize(
                'We couldn’t verify your personal details with our records, to enable deposit, withdrawals and trading, you need to upload proof of your identity.'
            ),
            type: 'danger',
        },
        needs_poa_virtual: {
            action: {
                route: routes.proof_of_address,
                text: localize('Verify address'),
            },
            key: 'needs_poa_virtual',
            header: localize('Please Verify your address'),
            message: localize(
                'We couldn’t verify your personal details with our records, to enable deposit, withdrawals and trading, you need to upload proof of your address.'
            ),
            type: 'danger',
        },
        documents_expired: {
            key: 'poi_expired',
            header: localize('Document expired'),
            message: localize('The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'),
            type: 'danger',
        },
        new_version_available: {
            action: {
                onClick: () => window.location.reload(),
                text: localize('Refresh now'),
            },
            key: 'new_version_available',
            header: localize('A new version of Deriv is available'),
            message: localize('This page will automatically refresh in 5 minutes to load the latest version.'),
            type: 'warning',
            should_hide_close_btn: true,
            timeout: 300000,
            timeoutMessage: remaining => localize('Auto update in {{ remaining }} seconds', { remaining }),
        },
        install_pwa: {
            key: 'install_pwa',
            action: {
                onClick: () => ui.installWithDeferredPrompt(),
                text: localize('Install'),
            },
            header: localize('Install the DTrader web app'),
            message: localize('Launch DTrader in seconds the next time you want to trade.'),
            type: 'announce',
            should_hide_close_btn: false,
        },
        ask_uk_funds_protection: {
            key: 'ask_uk_funds_protection',
            header: localize('Cashier is locked'),
            message: (
                <Localize
                    i18n_default_text='Your cashier is locked. See <0>how we protect your funds</0> before you proceed.'
                    components={[<BinaryLink key={0} className='link' to={routes.cashier_deposit} />]}
                />
            ),
            type: 'warning',
        }
    };
    return notifications;
};

const hasMissingRequiredField = (account_settings, client, isAccountOfType) => {
    if (!account_settings || isEmptyObject(account_settings)) return false;

    const { is_svg, landing_company_shortcode } = client;

    // TODO: [deriv-eu] refactor into its own function once more exceptions are added.
    let required_fields;
    if (is_svg) {
        required_fields = getSVGRequiredFields();
    } else {
        required_fields = getRequiredFields();
    }

    return required_fields.some(field => !account_settings[field]);

    function getSVGRequiredFields() {
        const necessary_withdrawal_fields =
            State.getResponse('landing_company.financial_company.requirements.withdrawal') || [];
        const necessary_signup_fields = State.getResponse('landing_company.financial_company.requirements.signup');

        const necessary_signup_fields_mapped = necessary_signup_fields
            ? necessary_signup_fields.map(field => (field === 'residence' ? 'country' : field))
            : [];

        return [...necessary_withdrawal_fields, ...necessary_signup_fields_mapped];
    }

    function getRequiredFields() {
        if (!isAccountOfType('financial')) return [];

        const { residence } = client;
        const required_settings_fields = [
            'account_opening_reason',
            'address_line_1',
            'address_city',
            'phone',
            'tax_identification_number',
            'tax_residence',
        ];

        const address_postcode_is_required = residence === 'gb' || landing_company_shortcode === 'iom';
        if (address_postcode_is_required) required_settings_fields.push('address_postcode');

        return [...required_settings_fields];
    }
};

const getStatusValidations = status_arr => {
    return status_arr.reduce((validations, stats) => {
        validations[stats] = true;
        return validations;
    }, {});
};

const getCashierValidations = cashier_arr => {
    return cashier_arr.reduce((validations, code) => {
        validations[code] = true;
        return validations;
    }, {});
};

const addVerificationNotifications = (identity, document, addNotificationMessage) => {
    if (identity.status === 'expired') addNotificationMessage(clientNotifications().poi_expired);

    if (document.status === 'expired') addNotificationMessage(clientNotifications().poa_expired);
};

const checkAccountStatus = (
    account_status,
    client,
    addNotificationMessage,
    loginid,
    getRiskAssessment,
    isAccountOfType
) => {
    if (isEmptyObject(account_status)) return {};
    if (loginid !== LocalStore.get('active_loginid')) return {};

    const {
        authentication: { document, identity, needs_verification },
        risk_classification,
        status,
        cashier_validation,
    } = account_status;

    const {
        cashier_locked,
        withdrawal_locked,
        deposit_locked,
        mt5_withdrawal_locked,
        document_needs_action,
        max_turnover_limit_not_set,
    } = getStatusValidations(status);

    const { 
        system_maintenance,
        documents_expired,
        unwelcome_status,
        no_withdrawal_or_trading_status,
        withdrawal_locked_status,
        cashier_locked_status,
        FinancialAssessmentRequired,
        SelfExclusion,
        ASK_CURRENCY,
        ASK_AUTHENTICATE,
        ASK_FINANCIAL_RISK_APPROVAL,
        ASK_TIN_INFORMATION,
        ASK_SELF_EXCLUSION_MAX_TURNOVER_SET,
        ASK_FIX_DETAILS,
        ASK_UK_FUNDS_PROTECTION,
    } = cashier_validation ? getCashierValidations(cashier_validation) : {};

    addVerificationNotifications(identity, document, addNotificationMessage);
    const should_show_max_turnover = client.landing_company_shortcode === 'iom' && max_turnover_limit_not_set;
    const has_risk_assessment = getRiskAssessment(account_status);
    if (system_maintenance) {
        addNotificationMessage(clientNotifications({}, client).system_maintenance(withdrawal_locked, deposit_locked));
    } else if (cashier_locked) {
        if(documents_expired) {
            addNotificationMessage(clientNotifications().documents_expired);
        } else if (cashier_locked_status) {
            addNotificationMessage(clientNotifications().cashier_locked);
        } else if (FinancialAssessmentRequired) {
            addNotificationMessage(clientNotifications().risk);
        } else if (ASK_CURRENCY) {
            addNotificationMessage(clientNotifications().currency);
        } else if (isAccountOfType('financial') && ASK_AUTHENTICATE) {
            addNotificationMessage(clientNotifications().authenticate);
        } else if (isAccountOfType('financial') && ASK_FINANCIAL_RISK_APPROVAL) {
            addNotificationMessage(clientNotifications().ask_financial_risk_approval);
        } else if (isAccountOfType('financial') && ASK_TIN_INFORMATION) {
            addNotificationMessage(clientNotifications().tax);
        } else if (ASK_SELF_EXCLUSION_MAX_TURNOVER_SET) {
            addNotificationMessage(clientNotifications().max_turnover_limit_not_set);
        } else if (ASK_FIX_DETAILS) {
            addNotificationMessage(clientNotifications().required_fields(withdrawal_locked, deposit_locked));
        } else if (ASK_UK_FUNDS_PROTECTION) {
            addNotificationMessage(clientNotifications().ask_uk_funds_protection);
        } 
    } else if (withdrawal_locked) {
        // if client is withdrawal locked but it's because they need to authenticate
        // and they have submitted verification documents,
        // we should wait for review of documents to be done and show a different message
        const is_high_risk = risk_classification === 'high';
        if (is_high_risk && ASK_AUTHENTICATE) {
            addNotificationMessage(clientNotifications().withdrawal_locked_review);
        } else if (no_withdrawal_or_trading_status) {
            addNotificationMessage(clientNotifications().no_withdrawal_or_trading);
        } else if (withdrawal_locked_status) {
            addNotificationMessage(clientNotifications().withdrawal_locked);
        } else if (ASK_FIX_DETAILS) {
            addNotificationMessage(clientNotifications().required_fields(withdrawal_locked, deposit_locked));
        } 
    } else if (deposit_locked) {
        if (SelfExclusion) {
            addNotificationMessage(clientNotifications().self_exclusion(client.excluded_until));
        } else if (ASK_FIX_DETAILS) {
            addNotificationMessage(clientNotifications().required_fields(withdrawal_locked, deposit_locked));
        } 
    }
    if (mt5_withdrawal_locked) addNotificationMessage(clientNotifications().mt5_withdrawal_locked);
    if (document_needs_action) addNotificationMessage(clientNotifications().document_needs_action);

    // if client is unwelcome because they need to submit verification, we don't need to show unwelcome message as well
    const should_hide_unwelcome =
        needs_verification.length ||
        /^pending|expired$/.test(document.status) ||
        /^pending|expired$/.test(identity.status);

    if (deposit_locked && unwelcome_status && !should_show_max_turnover && !should_hide_unwelcome) {
        addNotificationMessage(clientNotifications().unwelcome);
    }

    return {
        has_risk_assessment,
    };
};

export const excluded_notifications = isMobile()
    ? ['contract_sold']
    : [
          'you_are_offline',
          'password_changed',
          'switch_to_tick_chart',
          'contract_sold',
          'maintenance',
          'bot_switch_account',
          'new_version_available',
      ];

export const handleClientNotifications = (client, client_store, ui_store, cashier_store) => {
    const {
        loginid,
        account_status,
        account_settings,
        getRiskAssessment,
        is_tnc_needed,
        isAccountOfType,
    } = client_store;
    const { addNotificationMessage, removeNotificationMessageByKey } = ui_store;
    const { is_p2p_visible } = cashier_store;

    if (loginid !== LocalStore.get('active_loginid')) return {};

    const { has_risk_assessment } = checkAccountStatus(
        account_status,
        client,
        addNotificationMessage,
        loginid,
        getRiskAssessment,
        isAccountOfType
    );
    if (is_p2p_visible) {
        addNotificationMessage(clientNotifications().dp2p);
    } else {
        removeNotificationMessageByKey({ key: clientNotifications().dp2p.key });
    }

    if (is_tnc_needed) addNotificationMessage(clientNotifications(ui_store).tnc);

    const has_missing_required_field = hasMissingRequiredField(account_settings, client, isAccountOfType);
    return {
        has_missing_required_field,
        has_risk_assessment,
    };
};
