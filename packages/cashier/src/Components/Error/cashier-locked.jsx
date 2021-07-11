import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CashierLocked = ({ current_currency_type, is_system_maintenance }) => {
    return (
        <div className='cashier-locked'>
            <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {localize('Cashier is locked')}
            </Text>
            <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                {is_system_maintenance
                    ? current_currency_type === 'fiat'
                        ? localize(
                              'Our cashier is temporarily down due to system maintenance. You can access the cashier as soon as the maintenance is complete.'
                          )
                        : localize(
                              'Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the cashier as soon as the maintenance is complete.'
                          )
                    : localize('Please check your email for details')}
            </Text>
        </div>
    );
};

CashierLocked.propTypes = {
    current_currency_type: PropTypes.string,
    is_system_maintenance: PropTypes.bool,
};

export default connect(({ client, modules }) => ({
    current_currency_type: client.current_currency_type,
    is_system_maintenance: modules.cashier.is_system_maintenance,
}))(CashierLocked);
