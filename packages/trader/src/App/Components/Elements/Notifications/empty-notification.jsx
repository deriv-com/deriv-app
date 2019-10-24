import React        from 'react';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';

const EmptyNotification = () => (
    <div className='notifications__empty-container'>
        <div className='notifications__empty'>
            <Icon icon='IconEmptyNotification' className='notifications__empty-icon' />
            <div className='notifications__empty-content'>
                <h4 className='notifications__empty-header'>
                    {localize('No Notifications')}
                </h4>
                <span className='notifications__empty-message'>
                    {localize('You have yet to receive any notifications')}
                </span>
            </div>
        </div>
    </div>
);

export { EmptyNotification };
