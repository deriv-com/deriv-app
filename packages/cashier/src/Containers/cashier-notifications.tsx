import React from 'react';
import { Icon, Counter } from '@deriv/components';

type CashierNotificationsProps = {
    p2p_notification_count: number;
};

const CashierNotifications = ({ p2p_notification_count }: CashierNotificationsProps) => (
    <React.Fragment>
        <Icon icon='IcCashier' className='header__icon' />
        {!!p2p_notification_count && <Counter className='cashier__counter' count={p2p_notification_count} />}
    </React.Fragment>
);

export default CashierNotifications;
