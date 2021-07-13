import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CashierLocked = ({ current_currency_type, is_deposit_lock, is_system_maintenance, is_withdrawal_lock }) => {
    let title = 'Cashier is locked';
    let message = 'Please check your email for details';

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
    current_currency_type: PropTypes.string,
    is_deposit_lock: PropTypes.bool,
    is_system_maintenance: PropTypes.bool,
    is_withdrawal_lock: PropTypes.bool,
};

export default connect(({ client, modules }) => ({
    current_currency_type: client.current_currency_type,
    is_deposit_lock: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.is_system_maintenance,
    is_withdrawal_lock: client.is_withdrawal_lock,
}))(CashierLocked);
