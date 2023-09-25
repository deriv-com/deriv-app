import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const EmptyNotification = () => (
    <div className='notifications-empty__container'>
        <div className='notifications-empty'>
            <Icon
                data_testid='dt_ic_box_icon'
                icon='IcBox'
                className='notifications-empty__icon'
                size={64}
                color='secondary'
            />
            <div className='notifications-empty__content'>
                <Text
                    as='h4'
                    size='xs'
                    weight='bold'
                    align='center'
                    color='less-prominent'
                    className='notifications-empty__header'
                >
                    <Localize i18n_default_text='No notifications' />
                </Text>
                <Text size='xxs' color='less-prominent' align='center'>
                    <Localize i18n_default_text='You have yet to receive any notifications' />
                </Text>
            </div>
        </div>
    </div>
);

export default EmptyNotification;
