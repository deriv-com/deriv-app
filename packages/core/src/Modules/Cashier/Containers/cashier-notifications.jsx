import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Counter } from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = ({ p2p_notification_count }) => (
    <React.Fragment>
        <Icon icon='IcCashier' className='header__icon' />
        {!!p2p_notification_count && <Counter className='cashier__counter' count={p2p_notification_count} />}
    </React.Fragment>
);

CashierNotifications.propTypes = {
    p2p_notification_count: PropTypes.number,
};

export default connect(({ modules }) => ({
    p2p_notification_count: modules.cashier.p2p_notification_count,
}))(CashierNotifications);
