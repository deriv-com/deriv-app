import React from 'react';
import { observer } from 'mobx-react';
import { MobileWrapper } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { TradeNotification } from './trade-notification.jsx';

const TradeNotifications = observer(({ show_trade_notifications }) => {
    const { notifications: { trade_notifications } = {} } = useStore();
    if (!show_trade_notifications || !trade_notifications.length) return null;

    return (
        <MobileWrapper>
            <div className='swipeable-notifications'>
                {trade_notifications.map(notification => (
                    <TradeNotification
                        key={notification.contract_id}
                        classname='swipeable-notifications__item'
                        notification={notification}
                    />
                ))}
            </div>
        </MobileWrapper>
    );
});

export default TradeNotifications;
