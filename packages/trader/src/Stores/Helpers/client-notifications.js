import React            from 'react';
import { formatDate }   from 'Utils/Date';
import ObjectUtils      from 'deriv-shared/utils/object';
import {
    getRiskAssessment,
    isAccountOfType,
    shouldAcceptTnc,
    shouldCompleteTax } from '_common/base/client_base';
import { BinaryLink }   from 'App/Components/Routes';
import { localize }     from 'App/i18n';
import routes           from 'Constants/routes';
import {
    LocalStore,
    State }             from '_common/storage';
import { urlFor }       from '_common/url';
import Localize         from '../../App/Components/Elements/localize.jsx';

// TODO: Update links to app_2 links when components are done.
/* eslint-disable react/jsx-no-target-blank */
export const clientNotifications = (ui = {}) => {
    return {
        currency: {
            key    : 'currency',
            header : localize('Set Currency'),
            message: (
                <Localize
                    i18n_default_text='Please set the <0>currency</0> of your account to enable trading.'
                    components={[
                        <a
                            key={0}
                            type='button'
                            className='link'
                            onClick={ui.openRealAccountSignup}
                        />,
                    ]}
                />
            ),
            type: 'danger',
        },
        self_exclusion: (excluded_until) => ({
            key    : 'self_exclusion',
            header : localize('Self-exclusion Detected'),
            message: (
                <Localize
                    i18n_default_text='You have opted to be excluded from Binary.com until {{exclusion_end}}. Please <0>contact us</0> for assistance.'
                    values={{ exclusion_end: formatDate(excluded_until, 'DD/MM/YYYY'), interpolation: { escapeValue: false } }}
                    components={[ <a key={0} className='link' target='_blank' href={urlFor('contact', undefined, undefined, true)} /> ]}
                />
            ),
            type: 'danger',
        }),
        authenticate: {
            key    : 'authenticate',
            header : localize('Account Authentication'),
            message: (
                <Localize
                    i18n_default_text='<0>Authenticate your account</0> now to take full advantage of all payment methods available.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_identity}
                        />,
                    ]}
                />
            ),
            type: 'info',
        },
        cashier_locked: {
            key    : 'cashier_locked',
            header : localize('Cashier Disabled'),
            message: localize('Deposits and withdrawals have been disabled on your account. Please check your email for more details.'),
            type   : 'warning',
        },
        withdrawal_locked: {
            key    : 'withdrawal_locked',
            header : localize('Withdrawal Disabled'),
            message: localize('Withdrawals have been disabled on your account. Please check your email for more details.'),
            type   : 'warning',
        },
        mt5_withdrawal_locked: {
            key    : 'mt5_withdrawal_locked',
            header : localize('MT5 Withdrawal Disabled'),
            message: localize('MT5 withdrawals have been disabled on your account. Please check your email for more details.'),
            type   : 'warning',
        },
        document_needs_action: {
            key    : 'document_needs_action',
            header : localize('Authentication Failed'),
            message: (
                <Localize
                    i18n_default_text='<0>Your Proof of Identity or Proof of Address</0> did not meet our requirements. Please check your email for further instructions.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_identity}
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        unwelcome: {
            key    : 'unwelcome',
            header : localize('Trading and Deposits Disabled'),
            message: (
                <Localize
                    i18n_default_text='Trading and deposits have been disabled on your account. Kindly contact <0>customer support</0> for assistance.'
                    components={[ <a key={0} className='link' target='_blank' href={urlFor('contact', undefined, undefined, true)} /> ]}
                />
            ),
            type: 'danger',
        },
        mf_retail: {
            key    : 'mf_retail',
            header : localize('Binary Options Trading Disabled'),
            message: (
                <Localize
                    i18n_default_text='Binary Options Trading has been disabled on your account. Kindly contact <0>customer support</0> for assistance.'
                    components={[ <a key={0} className='link' target='_blank' href={urlFor('contact', undefined, undefined, true)} /> ]}
                />
            ),
            type: 'danger',
        },
        financial_limit: {
            key    : 'financial_limit',
            header : localize('Remove Deposit Limits'),
            message: (
                <Localize
                    i18n_default_text='Please set your <0>30-day turnover limit</0> to remove deposit limits.'
                    components={[ <a key={0} className='link' target='_blank' href={urlFor('user/security/self_exclusionws', undefined, undefined, true)} /> ]}
                />
            ),
            type: 'warning',
        },
        risk: {
            key    : 'risk',
            header : localize('Withdrawal and Trading Limits'),
            message: (
                <Localize
                    i18n_default_text='Please complete the <0>Financial Assessment form</0> to lift your withdrawal and trading limits.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.financial_assessment}
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        tax: {
            key    : 'tax',
            header : localize('Complete your personal details'),
            message: (
                <Localize
                    i18n_default_text='Please complete your <0>Personal Details</0> before you proceed.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.personal_details}
                        />,
                    ]}
                />
            ),
            type: 'danger',
        },
        tnc: {
            key    : 'tnc',
            header : localize('Terms & Conditions Updated'),
            message: (
                <Localize
                    i18n_default_text='Please <0>accept the updated Terms and Conditions</0> to enable deposit and trading.'
                    components={[ <a key={0} className='link' target='_blank' href={urlFor('user/tnc_approvalws', undefined, undefined, true)} /> ]}
                />
            ),
            type: 'danger',
        },
        required_fields: {
            key    : 'required_fields',
            header : localize('Complete your personal details'),
            message: (
                <Localize
                    i18n_default_text='Please complete your <0>Personal Details</0> before you proceed.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.personal_details}
                        />,
                    ]}
                />
            ),
            type: 'danger',
        },
        switch_to_tick_chart: {
            key    : 'switch_to_tick_chart',
            header : localize('This chart display is not ideal for tick contracts'),
            message: (
                <Localize
                    i18n_default_text='Please change the chart duration to tick for a better trading experience.'
                />
            ),
            type: 'info',
        },
        you_are_offline: {
            key    : 'you_are_offline',
            header : localize('You are offline'),
            message: (
                <Localize i18n_default_text='Check your connection.' />
            ),
            type: 'danger',
        },
        password_changed: {
            key    : 'password_changed',
            header : localize('Password updated.'),
            message: (
                <Localize
                    i18n_default_text='Please log in with your updated password.'
                />
            ),
            type: 'info',
        },
        needs_poi: {
            key    : 'needs_poi',
            header : localize('Proof of identity required'),
            message: (
                <Localize
                    i18n_default_text='Please <0>submit</0> your proof of identity.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_identity}
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        needs_poa: {
            key    : 'needs_poa',
            header : localize('Proof of address required'),
            message: (
                <Localize
                    i18n_default_text='Please <0>submit</0> your proof of address.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_address}
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        poa_expired: {
            key    : 'poa_expired',
            header : localize('Document expired'),
            message: (
                <Localize
                    i18n_default_text='Your documents for proof of address is expired. Please <0>submit</0> again.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_address}
                        />,
                    ]}
                />
            ),
            type: 'danger',
        },
        poa_rejected: {
            key    : 'poa_rejected',
            header : localize('We could not verify your proof of address'),
            message: (
                <Localize
                    i18n_default_text='We have disabled trading, deposits and withdrawals for this account.'
                />
            ),
            type: 'danger',
        },
        poi_expired: {
            key    : 'poi_expired',
            header : localize('Proof of identity expired'),
            message: (
                <Localize
                    i18n_default_text='Your proof of identity document has expired. Please <0>submit</0> a new one.'
                    components={[
                        <BinaryLink
                            key={0}
                            className='link'
                            to={routes.proof_of_identity}
                        />,
                    ]}
                />
            ),
            type: 'danger',
        },
    };
};

const hasMissingRequiredField = (account_settings, client) => {
    if (!account_settings) return false;

    const { landing_company_shortcode } = client;
    const is_svg = (landing_company_shortcode === 'svg' || landing_company_shortcode === 'costarica');

    let required_fields;
    if (is_svg) {
        required_fields = getSVGRequiredFields();
    } else {
        required_fields = getRequiredFields();
    }

    return required_fields.some(field => !account_settings[field]);

    function getSVGRequiredFields() {
        const necessary_withdrawal_fields = State.getResponse('landing_company.financial_company.requirements.withdrawal');
        const necessary_signup_fields     = State.getResponse('landing_company.financial_company.requirements.signup')
            .map(field => (field === 'residence' ? 'country' : field));

        return [...necessary_withdrawal_fields, ...necessary_signup_fields];
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
            'tax_residence'];
        const address_postcode_is_required = (residence === 'gb' || landing_company_shortcode === 'iom');
        if (address_postcode_is_required) required_settings_fields.push('address_postcode');

        return [...required_settings_fields];
    }
};

const getStatusValidations = status_arr =>
    status_arr.reduce((validations, stats) => {
        validations[stats] = true;
        return validations;
    }, {});

const addVerificationNotifications = (identity, document, addNotificationMessage) => {
    if (identity.status === 'expired') addNotificationMessage(clientNotifications().poi_expired);

    if (document.status === 'expired') addNotificationMessage(clientNotifications().poa_expired);
};

const checkAccountStatus = (account_status, client, addNotificationMessage, loginid) => {
    if (ObjectUtils.isEmptyObject(account_status)) return {};
    if (loginid !== LocalStore.get('active_loginid')) return {};

    const {
        authentication: {
            document,
            identity,
            needs_verification,
            prompt_client_to_authenticate,
        },
        status,
    } = account_status;

    const {
        cashier_locked,
        withdrawal_locked,
        mt5_withdrawal_locked,
        document_needs_action,
        unwelcome,
        ukrts_max_turnover_limit_not_set,
        professional,
    } = getStatusValidations(status);

    addVerificationNotifications(identity, document, addNotificationMessage);

    const is_mf_retail         = client.landing_company_shortcode === 'maltainvest' && !professional;
    const needs_authentication = needs_verification.length && document.status === 'none' && identity.status === 'none';
    const has_risk_assessment  = getRiskAssessment(account_status);
    const needs_poa            = needs_verification.length &&
        needs_verification.includes('document') &&
        !needs_verification.includes('identity') &&
        document.status !== 'rejected';
    const needs_poi            = needs_verification.length &&
        needs_verification.includes('identity') &&
        !needs_verification.includes('document') &&
        identity.status !== 'rejected';

    if (needs_poa)             addNotificationMessage(clientNotifications().needs_poa);
    if (needs_poi)             addNotificationMessage(clientNotifications().needs_poi);
    if (cashier_locked)        addNotificationMessage(clientNotifications().cashier_locked);
    if (withdrawal_locked)     addNotificationMessage(clientNotifications().withdrawal_locked);
    if (mt5_withdrawal_locked) addNotificationMessage(clientNotifications().mt5_withdrawal_locked);
    if (document_needs_action) addNotificationMessage(clientNotifications().document_needs_action);
    if (unwelcome)             addNotificationMessage(clientNotifications().unwelcome);
    if (is_mf_retail)          addNotificationMessage(clientNotifications().mf_retail);

    if (ukrts_max_turnover_limit_not_set) {
        addNotificationMessage(clientNotifications().financial_limit);
    }
    if (has_risk_assessment)               addNotificationMessage(clientNotifications().risk);
    if (shouldCompleteTax(account_status)) addNotificationMessage(clientNotifications().tax);
    if (needs_authentication || prompt_client_to_authenticate) {
        addNotificationMessage(clientNotifications().authenticate);
    }

    return {
        has_risk_assessment,
    };
};

export const excluded_notifications = ['you_are_offline', 'password_changed', 'switch_to_tick_chart', 'contract_sold'];

export const handleClientNotifications = (
    client,
    account_settings,
    account_status,
    addNotificationMessage,
    loginid,
    ui
) => {
    const { currency, excluded_until } = client;
    if (loginid !== LocalStore.get('active_loginid')) return {};
    if (!currency)      addNotificationMessage(clientNotifications(ui).currency);
    if (excluded_until) {
        addNotificationMessage(clientNotifications(ui).self_exclusion(excluded_until));
    }

    const { has_risk_assessment } = checkAccountStatus(account_status, client, addNotificationMessage, loginid);

    if (shouldAcceptTnc(account_settings)) addNotificationMessage(clientNotifications(ui).tnc);

    const has_missing_required_field = hasMissingRequiredField(account_settings, client);
    if (has_missing_required_field) {
        addNotificationMessage(clientNotifications(ui).required_fields);
    }

    return {
        has_missing_required_field,
        has_risk_assessment,
    };
};
