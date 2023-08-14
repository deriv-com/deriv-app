import classNames from 'classnames';
import React, { LegacyRef } from 'react';
import { Text, ThemedScrollbars } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import EmptyNotification from 'App/Components/Elements/Notifications/empty-notification';
import ClearAllFooter from './notifications-clear-all-footer';
import NotificationsList from './notifications-list';

type TNotificationListWrapper = { clearNotifications: () => void };

const NotificationListWrapperForwardRef = React.forwardRef(
    ({ clearNotifications }: TNotificationListWrapper, ref: LegacyRef<HTMLDivElement> | undefined) => {
        const { notifications } = useStore();
        const { notifications: notifications_array } = notifications;
        const is_empty = !notifications_array?.length;

        const traders_hub = window.location.pathname === routes.traders_hub;

        return (
            <div
                data-testid='dt_notifications_list_wrapper'
                className={classNames('notifications-dialog', {
                    'notifications-dialog--pre-appstore':
                        traders_hub || window.location.pathname.startsWith(routes.account),
                })}
                ref={ref}
            >
                <div className='notifications-dialog__header'>
                    <Text
                        as='h2'
                        className='notifications-dialog__header-text'
                        size='s'
                        weight='bold'
                        color='prominent'
                        styles={{
                            lineHeight: '1.6rem',
                        }}
                    >
                        <Localize i18n_default_text='Notifications' />
                    </Text>
                </div>
                <div
                    className={classNames('notifications-dialog__content', {
                        'notifications-dialog__content--empty': is_empty,
                    })}
                >
                    <ThemedScrollbars is_bypassed={isMobile() || is_empty}>
                        {is_empty ? <EmptyNotification /> : <NotificationsList />}
                    </ThemedScrollbars>
                </div>
                <ClearAllFooter clearNotifications={clearNotifications} />
            </div>
        );
    }
);
NotificationListWrapperForwardRef.displayName = 'NotificationListWrapper';

const NotificationListWrapper = observer(NotificationListWrapperForwardRef);

export default NotificationListWrapper;
