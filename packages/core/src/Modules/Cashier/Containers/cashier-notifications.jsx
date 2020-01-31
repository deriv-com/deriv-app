import React       from 'react';
import PropTypes   from 'prop-types';
import { Icon, Counter }    from '@deriv/components';
import { connect } from 'Stores/connect';

const CashierNotifications = (({ notifications }) => {
    return (
        <React.Fragment>
            <Icon icon='IcCashier' className='header__icon' />
            {!!notifications &&
                <Counter
                    count={notifications}
                />
            }
        </React.Fragment>
    )
});

CashierNotifications.propTypes = {
    notifications: PropTypes.number,
}

export default connect(
    ({ modules }) => ({
        p2p_notifications                : modules.cashier.p2p_notifications,
    })
)(CashierNotifications);
