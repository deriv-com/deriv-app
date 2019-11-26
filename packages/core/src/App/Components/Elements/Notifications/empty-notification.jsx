import React        from 'react';
import { localize } from 'deriv-translations';
import Icon         from 'Assets/icon.jsx';

const EmptyNotification = () => (
    <div className='notifications-empty__container'>
        <div className='notifications-empty'>
            <Icon icon='IconEmptyNotification' className='notifications-empty__icon' />
            <div className='notifications-empty__content'>
                <h4 className='notifications-empty__header'>
                    {localize('No notifications')}
                </h4>
                <span className='notifications-empty__message'>
                    {localize('You have yet to receive any notifications')}
                </span>
            </div>
        </div>
    </div>
);

export { EmptyNotification };
