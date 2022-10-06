import React from 'react';
import { Icon, Counter } from '@deriv/components';

type TCashierNotificationsProps = {
    p2p_notification_count: number;
};

const CashierNotifications = ({ p2p_notification_count }: TCashierNotificationsProps) => (
    <React.Fragment>
        <Icon icon='IcCashier' className='header__icon' />
        <Counter className='cashier__counter' count={2} />
    </React.Fragment>
);

export default CashierNotifications;
