import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Counter } from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = ({ notification_count }) => (
    <React.Fragment>
        <Icon icon='IcCashier' className='header__icon' />
        {!!notification_count && <Counter className='cashier__counter' count={notification_count} />}
    </React.Fragment>
);

CashierNotifications.propTypes = {
    notifications: PropTypes.number,
};

export default connect(({ modules }) => ({
    notification_count: modules.cashier.notification_count,
}))(CashierNotifications);
