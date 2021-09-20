import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CashierLocked = ({
    account_status,
    current_currency_type,
    is_deposit_lock,
    is_system_maintenance,
    is_withdrawal_lock,
}) => {
    let title = 'Cashier is locked';
    let message = 'Please check your email for details';

    const { cashier_validation } = account_status;
    const no_residence = cashier_validation?.includes('no_residence');
    if (is_system_maintenance) {
        if (current_currency_type === 'crypto') {
            if (is_withdrawal_lock) {
                title = 'Withdrawals are locked';
                message =
                    'Our cashier is temporarily down due to system maintenance. Please make your withdrawals when the maintenance is complete.';
            } else if (is_deposit_lock) {
                title = 'Deposits are locked';
                message =
                    'Our cashier is temporarily down due to system maintenance. Please make your deposits when the maintenance is complete.';
            } else {
                message =
                    'Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the cashier as soon as the maintenance is complete.';
            }
        } else {
            message =
                'Our cashier is temporarily down due to system maintenance. You can access the cashier as soon as the maintenance is complete.';
        }
    } else if (no_residence) {
        message = localize(
            'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
        );
    }

    return (
        <div className='cashier-locked'>
            <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {localize(title)}
            </Text>
            <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                {localize(message)}
            </Text>
        </div>
    );
};

CashierLocked.propTypes = {
    account_status: PropTypes.object,
    current_currency_type: PropTypes.string,
    is_deposit_lock: PropTypes.bool,
    is_system_maintenance: PropTypes.bool,
    is_withdrawal_lock: PropTypes.bool,
};

export default connect(({ client, modules }) => ({
    account_status: client.account_status,
    current_currency_type: client.current_currency_type,
    is_deposit_lock: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.is_system_maintenance,
    is_withdrawal_lock: client.is_withdrawal_lock,
}))(CashierLocked);
