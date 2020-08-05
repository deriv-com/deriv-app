import React from 'react';
import PropTypes from 'prop-types';
import { Counter } from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = ({ p2p_notification_count }) => {
    return p2p_notification_count ? <Counter className='header__counter' count={p2p_notification_count} /> : null;
};

CashierNotifications.propTypes = {
    p2p_notification_count: PropTypes.number,
};

export default connect(({ modules }) => ({
    p2p_notification_count: modules.p2p.unread_notification_count,
}))(CashierNotifications);
