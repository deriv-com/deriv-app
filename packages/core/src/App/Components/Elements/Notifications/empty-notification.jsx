import React        from 'react';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';

const EmptyNotification = () => (
    <div className='drawer__no-notifications-container'>
        <div className='drawer__no-notifications'>
            <div className='drawer__bell'>
                <Icon icon='IconBell' className='drawer__bell-icon' />
            </div>
            <div>
                <h4 className='drawer__no-notifications-header'>{localize('No Notifications')}</h4>
                <span className='drawer__no-notifications-message'>{localize('You have yet to receive any notifications')}</span>
            </div>
        </div>
    </div>
);

export { EmptyNotification };
