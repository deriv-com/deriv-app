import React from 'react';
import classNames from 'classnames';
import { Button, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TNotificationsClearAllFooter = {
    clearNotifications: () => void;
};

const NotificationsClearAllFooter = observer(({ clearNotifications }: TNotificationsClearAllFooter) => {
    const { notifications } = useStore();
    const { notifications: notifications_array } = notifications;
    const is_empty = !notifications_array?.length;

    return (
        <React.Fragment>
            <div className='notifications-dialog__separator' />
            <div
                data-testid='dt_clear_all_footer_button'
                className={classNames('notifications-dialog__footer', {
                    'notifications-dialog__content--empty': is_empty,
                    'notifications-dialog__content--sticky': isMobile(),
                })}
            >
                <Button
                    className={classNames('dc-btn--secondary', 'notifications-dialog__clear')}
                    disabled={is_empty}
                    onClick={clearNotifications}
                >
                    <Text size='xxs' color='prominent' weight='bold'>
                        {localize('Clear All')}
                    </Text>
                </Button>
            </div>
        </React.Fragment>
    );
});

export default NotificationsClearAllFooter;
