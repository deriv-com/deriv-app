import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared';
import { connect } from 'Stores/connect';

const CashierLocked = ({ 
    account_status, 
    accounts, 
    current_currency_type, 
    is_deposit_lock, 
    is_system_maintenance, 
    is_withdrawal_lock, 
    loginid 
}) => {
    const { cashier_validation } = account_status;
    const no_residence = cashier_validation.includes('no_residence');
    const documents_expired = cashier_validation.includes('documents_expired');
    const unwelcome_status = cashier_validation.includes('unwelcome_status');
    const no_withdrawal_or_trading_status = cashier_validation.includes('no_withdrawal_or_trading_status');
    const withdrawal_locked_status = cashier_validation.includes('withdrawal_locked_status');
    const cashier_locked_status = cashier_validation.includes('cashier_locked_status');
    const disabled_status = cashier_validation.includes('disabled_status');
    const financial_assessment_required = cashier_validation.includes('FinancialAssessmentRequired');
    const self_exclusion = cashier_validation.includes('SelfExclusion');
    const ask_currency = cashier_validation.includes('ASK_CURRENCY');
    const ask_authenticate = cashier_validation.includes('ASK_AUTHENTICATE');
    const ask_financial_risk_approval = cashier_validation.includes('ASK_FINANCIAL_RISK_APPROVAL');
    const ask_tin_information = cashier_validation.includes('ASK_TIN_INFORMATION');
    const ask_self_exclusion_max_turnover_set = cashier_validation.includes('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET');
    const ask_fix_details = cashier_validation.includes('ASK_FIX_DETAILS');
    let title = localize('Cashier is locked');
    let message = localize('Please check your email for details');

    if (is_system_maintenance) {
        if (current_currency_type === 'crypto') {
            if (is_withdrawal_lock) {
                title = localize('Withdrawals are locked');
                message = localize('Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.');
            } else if (is_deposit_lock) {
                title = 'Deposits are locked';
                message = localize('Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.');
            } else {
                message = localize('Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.');
            }
        } else {
            message = localize('Our cashier is temporarily down due to system maintenance.You can access the Cashier in a few minutes when the maintenance is complete.');
        }
    } else {
        if (no_residence) {
            message = localize('You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.');
        }
        if (documents_expired) {
            message = localize('The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier. ');
        }
        if (is_deposit_lock && unwelcome_status) {
            title = localize('Deposits are locked');
            message = localize('Unfortunately, you can only make withdrawals. Please contact us via live chat to enable deposits.');
        }
        if (is_withdrawal_lock && no_withdrawal_or_trading_status) {
            title = localize('Withdrawals are locked');
            message = localize('Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.');
        }
        if (is_withdrawal_lock && withdrawal_locked_status) {
            title = localize('Withdrawals are locked');
            message = localize('Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.');
        }
        if (cashier_locked_status) {
            message = localize('Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.');
        }
        if (disabled_status) {
            message = localize('Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.');
        }
        if (financial_assessment_required) {
            message = localize('You’ve reached your account withdrawal and trading limits. Please complete the financial assessment form to make withdrawals and continue trading.');
        }
        if (is_deposit_lock && self_exclusion) {
            let excluded_until = accounts[loginid].excluded_until;
            excluded_until = formatDate(excluded_until, 'DD MMM, YYYY');
            title = localize('Deposits are locked');
            message = localize('You have chosen to exclude yourself from trading on our website until {{exclude_until}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.', {
                exclude_until : excluded_until,
            });
        }
        if (ask_currency) {
            message = localize('Please set your account currency to enable deposits and withdrawals.');
        }
        if (ask_authenticate) {
            if (is_withdrawal_lock) {
                message = localize('Your account has not been authenticated. Please submit your proof of identity and proof of address to authenticate your account and request for withdrawals.');
            } else {
                title = localize('Withdrawals are locked');
                message = localize('Your account has not been authenticated. Please submit your proof of identity and proof of address to authenticate your account and access your cashier.');
            }
        }
        if (ask_financial_risk_approval) {
            message = localize('Please complete the Appropriateness Test to access your cashier.');
        }
        if (ask_tin_information) {
            message = localize('You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to Personal details in your account settings, and fill in your latest tax identification number.');
        }
        if (ask_self_exclusion_max_turnover_set) {
            message = localize('Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to Self-exclusion and set your 30-day turnover limit.');
        }
        if (ask_fix_details) {
            if (is_withdrawal_lock) {
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable deposits.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            } else if (is_deposit_lock) {
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            } else {
                message = localize('Your {{opening_tag}}personal details{{closing_tag}} are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.', {
                    opening_tag  : '<a href="/account/personal-details" rel="noopener noreferrer" target="_blank" class="link">',
                    closing_tag  : '</a>',
                    interpolation: { escapeValue: false },
                });
            }
        }
    }

    return (
        <div className='cashier-locked'>
            <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {title}
            </Text>
            <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                {message}
            </Text>
        </div>
    );
};

CashierLocked.propTypes = {
    account_status: PropTypes.object,
    accounts: PropTypes.object,
    current_currency_type: PropTypes.string,
    is_deposit_lock: PropTypes.bool,
    is_system_maintenance: PropTypes.bool,
    is_withdrawal_lock: PropTypes.bool,
    loginid: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    account_status: client.account_status,
    accounts: client.accounts,
    current_currency_type: client.current_currency_type,
    is_deposit_lock: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.is_system_maintenance,
    is_withdrawal_lock: client.is_withdrawal_lock,
    loginid: client.loginid,
}))(CashierLocked);
