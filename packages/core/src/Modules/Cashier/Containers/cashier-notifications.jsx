import React       from 'react';
import PropTypes   from 'prop-types';
import { Icon, Counter }    from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = ({ p2p_notifications }) => {
    console.log(p2p_notifications);
    return (
        <React.Fragment>
            <Icon icon='IcCashier' className='header__icon' />
            {!!p2p_notifications &&
                <Counter
                    className='cashier__counter'
                    count={p2p_notifications}
                />
            }
        </React.Fragment>
    )
};

CashierNotifications.propTypes = {
    notifications: PropTypes.number,
}

export default connect(
    ({ modules }) => ({
        p2p_notifications: modules.cashier.p2p_notifications,
    }),
)(CashierNotifications);