import React from 'react';
import { GetAccountStatus, Authorize } from '@deriv/api-types';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';

type TAccount = NonNullable<Authorize['account_list']>[0];

type TCashierLockedProps = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    current_currency_type: string;
    is_cashier_locked: boolean;
    is_deposit_locked: boolean;
    is_identity_verification_needed: boolean;
    is_system_maintenance: boolean;
    is_withdrawal_locked: boolean;
    loginid: string;
};

const CashierLocked = ({
    account_status,
    accounts,
    current_currency_type,
    is_cashier_locked,
    is_deposit_locked,
    is_system_maintenance,
    is_withdrawal_locked,
    loginid,
    is_identity_verification_needed,
}: TCashierLockedProps) => {
    const { cashier_validation } = account_status;
    const no_residence = cashier_validation?.includes('no_residence');
    const unwelcome_status = cashier_validation?.includes('unwelcome_status');
    const self_exclusion = cashier_validation?.includes('SelfExclusion');
    const no_withdrawal_or_trading_status = cashier_validation?.includes('no_withdrawal_or_trading_status');
    const only_pa_withdrawals_allowed_status = cashier_validation?.includes('only_pa_withdrawals_allowed_status');
    const withdraw_service_unavailable_for_pa = cashier_validation?.includes('WithdrawServiceUnavailableForPA');
    const withdrawal_locked_status = cashier_validation?.includes('withdrawal_locked_status');
    const documents_expired = cashier_validation?.includes('documents_expired');
    const cashier_locked_status = cashier_validation?.includes('cashier_locked_status');
    const disabled_status = cashier_validation?.includes('disabled_status');
    const financial_assessment_required = cashier_validation?.includes('FinancialAssessmentRequired');
    const ask_currency = cashier_validation?.includes('ASK_CURRENCY');
    const ask_authenticate = cashier_validation?.includes('ASK_AUTHENTICATE');
    const ask_financial_risk_approval = cashier_validation?.includes('ASK_FINANCIAL_RISK_APPROVAL');
    const ask_tin_information = cashier_validation?.includes('ASK_TIN_INFORMATION');
    const ask_self_exclusion_max_turnover_set = cashier_validation?.includes('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET');
    const ask_fix_details = cashier_validation?.includes('ASK_FIX_DETAILS');
    const ask_uk_funds_protection = cashier_validation?.includes('ASK_UK_FUNDS_PROTECTION');
    const pa_commision_withdrawal_limit = cashier_validation?.includes('PACommisionWithdrawalLimit');

    let icon = 'IcCashierLocked';
    let title = localize('Cashier is locked');
    let message = localize(
        'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
    );

    if (is_system_maintenance) {
        if (current_currency_type === 'crypto') {
            if (is_withdrawal_locked) {
                title = localize('Withdrawals are locked');
                message = localize(
                    'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
                );
            } else if (is_deposit_locked) {
                title = 'Deposits are locked';
                message = localize(
                    'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
                );
            } else {
                message = localize(
                    'Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
                );
            }
        } else {
            message = localize(
                'Our cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
            );
        }
    } else if (is_cashier_locked) {
        if (no_residence) {
            message = localize(
                'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
            );
        } else if (documents_expired) {
            message = localize(
                'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier. '
            );
        } else if (cashier_locked_status) {
            message = localize(
                'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
            );
        } else if (disabled_status) {
            message = localize(
                'Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'
            );
        } else if (ask_currency) {
            message = localize('Please set your account currency to enable deposits and withdrawals.');
        } else if (ask_authenticate) {
            if (is_identity_verification_needed) {
                message = (
                    <Localize
                        i18n_default_text='Please submit your <0>proof of identity</0> to authenticate your account and access your Cashier.'
                        components={[<a key={0} className='link' href={'/account/proof-of-identity'} />]}
                    />
                );
            } else {
                message = (
                    <Localize
                        i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your cashier.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                href={'/account/proof-of-identity'}
                            />,
                            <a key={1} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                        ]}
                    />
                );
            }
        } else if (ask_financial_risk_approval) {
            message = (
                <Localize
                    i18n_default_text='Please complete the <0>Appropriateness Test</0> to access your cashier.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            href={'/account/financial-assessment'}
                            data-testid='dt_financial_assessment_link'
                        />,
                    ]}
                />
            );
        } else if (financial_assessment_required) {
            message = (
                <Localize
                    i18n_default_text='Your cashier is locked. Please complete the <0>financial assessment</0> to unlock it.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            href={'/account/financial-assessment'}
                            data-testid='dt_financial_assessment_link'
                        />,
                    ]}
                />
            );
        } else if (ask_tin_information) {
            message = (
                <Localize
                    i18n_default_text='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings, and fill in your latest tax identification number.'
                    components={[
                        <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                    ]}
                />
            );
        } else if (ask_uk_funds_protection) {
            message = (
                <Localize
                    i18n_default_text='Your cashier is locked. See <0>how we protect your funds</0> before you proceed.'
                    components={[<a key={0} className='link' rel='noopener noreferrer' href={'/cashier/deposit'} />]}
                />
            );
        } else if (ask_self_exclusion_max_turnover_set) {
            message = (
                <Localize
                    i18n_default_text='Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                    components={[
                        <a key={0} className='link' rel='noopener noreferrer' href={'/account/self-exclusion'} />,
                    ]}
                />
            );
        } else if (ask_fix_details) {
            message = (
                <Localize
                    i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.'
                    components={[
                        <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                    ]}
                />
            );
        }
    } else if (is_deposit_locked && ask_fix_details) {
        icon = 'IcCashierDepositLock';
        title = localize('Deposits are locked');
        message = (
            <Localize
                i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                ]}
            />
        );
    } else if (is_deposit_locked && self_exclusion) {
        icon = 'IcCashierDepositLock';
        title = localize('Deposits are locked');
        message = localize(
            'You have chosen to exclude yourself from trading on our website until {{exclude_until}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.',
            {
                exclude_until: formatDate(accounts[loginid].excluded_until, 'DD MMM, YYYY'),
            }
        );
    } else if (is_deposit_locked && unwelcome_status) {
        icon = 'IcCashierDepositLock';
        title = localize('Deposits are locked');
        message = localize('Please contact us via live chat.');
    } else if (is_withdrawal_locked && financial_assessment_required) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = (
            <Localize
                i18n_default_text='You can only make deposits. Please complete the <0>financial assessment</0> to unlock withdrawals.'
                components={[
                    <a
                        key={0}
                        className='link'
                        href={'/account/financial-assessment'}
                        data-testid='dt_financial_assessment_link'
                    />,
                ]}
            />
        );
    } else if (is_withdrawal_locked && ask_authenticate) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = (
            <Localize
                i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/proof-of-identity'} />,
                    <a key={1} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                ]}
            />
        );
    } else if (is_withdrawal_locked && ask_fix_details) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = (
            <Localize
                i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                ]}
            />
        );
    } else if (is_withdrawal_locked && withdraw_service_unavailable_for_pa) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = localize('This feature is not available for payment agents.');
    } else if (is_withdrawal_locked && no_withdrawal_or_trading_status) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = localize(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    } else if (is_withdrawal_locked && withdrawal_locked_status) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = localize(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    } else if (is_withdrawal_locked && only_pa_withdrawals_allowed_status) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Withdrawals are locked');
        message = localize('You can only make deposits. Please contact us via live chat for more information.');
    } else if (is_withdrawal_locked && pa_commision_withdrawal_limit) {
        icon = 'IcCashierWithdrawalLock';
        title = localize('Cashier is locked for withdrawals');
        message = localize(
            "It seems that you've no commissions to withdraw at the moment. You can make withdrawals once you receive your commissions."
        );
    }

    return (
        <div className='cashier-locked'>
            <Icon icon={icon} className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {title}
            </Text>
            <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                {message}
            </Text>
        </div>
    );
};

export default connect(({ client, modules }: RootStore) => ({
    account_status: client.account_status,
    accounts: client.accounts,
    current_currency_type: client.current_currency_type,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_deposit_locked: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.general_store.is_system_maintenance,
    is_withdrawal_locked: client.is_withdrawal_lock,
    loginid: client.loginid,
    is_identity_verification_needed: client.is_identity_verification_needed,
}))(CashierLocked);
