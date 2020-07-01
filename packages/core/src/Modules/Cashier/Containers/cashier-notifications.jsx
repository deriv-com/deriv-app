import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Counter } from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = ({ unread_notification_count }) => (
    <React.Fragment>
        <Icon icon='IcCashier' className='header__icon' />
        {!!unread_notification_count && <Counter className='cashier__counter' count={unread_notification_count} />}
    </React.Fragment>
);

CashierNotifications.propTypes = {
    unread_notification_count: PropTypes.number,
};

export default connect(({ modules }) => ({
    unread_notification_count: modules.p2p.unread_notification_count,
}))(CashierNotifications);
