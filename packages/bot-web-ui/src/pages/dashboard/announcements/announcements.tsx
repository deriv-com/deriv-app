import React, { useEffect, useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { BOT_ANNOUNCEMENTS_LIST, TAnnouncement, TNotifications } from './config';
import './announcements.scss';
import { MessageAnnounce, TitleAnnounce } from './announcement-components';
import { getButtonAction } from './utils/accumulator-helper-functions';

type TAnnouncements = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = ({ is_mobile, handleTabChange }: TAnnouncements) => {
    const [is_announce_dialog_open, setIsAnnounceDialogOpen] = useState(false);
    const [is_open_announce_list, setIsOpenAnnounceList] = React.useState(false);
    const [selected_announcement, setSelectedAnnouncement] = React.useState<TAnnouncement | null>(null);
    const [stored_notifications, setStoredNotifications] = React.useState({} as Record<string, boolean>);
    const history = useHistory();
    const [notifications, setNotifications] = useState([] as TNotifications[]);

    const storeDataInLocalStorage = (temp_data: Record<string, boolean>) => {
        localStorage?.setItem('bot-announcements', JSON.stringify(temp_data));
    };

    const modalButtonAction = (announce_id: string, announcement: TAnnouncement) => () => {
        setSelectedAnnouncement(announcement);
        setIsAnnounceDialogOpen(true);
        setIsOpenAnnounceList(prev => !prev);

        let data: Record<string, boolean> | null = null;
        data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');

        storeDataInLocalStorage({ ...data, [announce_id]: false });
        const temp_notifications = updateNotifications();
        setStoredNotifications(temp_notifications);
    };

    const handleRedirect = (url: string) => {
        if (history) {
            history.push(url);
        }
    };

    const updateNotifications = () => {
        let data: Record<string, boolean> | null = null;
        data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');
        const tmp_notifications: TNotifications[] = [];
        const temp_localstorage_data: Record<string, boolean> | null = {};
        BOT_ANNOUNCEMENTS_LIST.map(item => {
            let is_not_read = true;
            if (data && Object.hasOwn(data, item.id)) {
                is_not_read = data[item.id];
            }
            tmp_notifications.push({
                key: item.id,
                icon: <item.icon announce={is_not_read} />,
                title: <TitleAnnounce title={item.title} announce={is_not_read} />,
                message: <MessageAnnounce message={item.message} date={item.date} announce={is_not_read} />,
                buttonAction: getButtonAction(item, modalButtonAction, handleRedirect),
                actionText: item.actionText,
            });
            temp_localstorage_data[item.id] = is_not_read;
        });
        setNotifications(tmp_notifications);
        return temp_localstorage_data;
    };

    useEffect(() => {
        const temp_localstorage_data = updateNotifications();
        storeDataInLocalStorage(temp_localstorage_data);
        setStoredNotifications(temp_localstorage_data);
    }, []);

    const countActiveAnnouncements = (): number => {
        return Object.values(stored_notifications as Record<string, boolean>).reduce(
            (count: number, value: boolean) => {
                return value === true ? count + 1 : count;
            },
            0
        );
    };

    useEffect(() => {
        () => countActiveAnnouncements();
    }, [stored_notifications]);

    const number_ammount_announce = countActiveAnnouncements();

    const handleOnCancel = () => {
        if (selected_announcement?.switch_tab_on_cancel) {
            handleTabChange(selected_announcement.switch_tab_on_cancel);
        }
        selected_announcement?.onCancel?.();
        setSelectedAnnouncement(null);
    };

    const handleOnConfirm = () => {
        if (selected_announcement?.switch_tab_on_confirm) {
            handleTabChange(selected_announcement.switch_tab_on_confirm);
        }
        selected_announcement?.onConfirm?.();
        setSelectedAnnouncement(null);
    };

    const clearNotificationsCallback = () => {
        const temp_stored_notifications = Object.fromEntries(
            Object.keys(stored_notifications).map(key => [key, false])
        );
        storeDataInLocalStorage(temp_stored_notifications);
        const temp_notifications = updateNotifications();
        setStoredNotifications(temp_notifications);
    };

    return (
        <div className='announcements'>
            <button
                className='announcements__button'
                onClick={() => setIsOpenAnnounceList(prevState => !prevState)}
                data-testid='btn-announcements'
            >
                <StandaloneBullhornRegularIcon fill='var(--icon-black-plus)' iconSize='sm' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='announcements__label'>
                        {localize('Announcements')}
                    </Text>
                )}
                {number_ammount_announce !== 0 && (
                    <div className='announcements__amount' data-testid='announcements__amount'>
                        <p>{number_ammount_announce}</p>
                    </div>
                )}
            </button>
            <div className='notifications__wrapper'>
                <Announcement
                    className={clsx('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                    })}
                    clearNotificationsCallback={clearNotificationsCallback}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcements'),
                        noNotificationsMessage: localize('No announcements MESSAGE'),
                        noNotificationsTitle: localize('No announcements'),
                    }}
                    isOpen={is_open_announce_list}
                    // eslint-disable-next-line no-empty-function
                    setIsOpen={() => {
                        /* Need to be fixed from the UI library*/
                    }}
                    notifications={notifications}
                />
            </div>
            {selected_announcement?.announcement && (
                <AnnouncementDialog
                    announcement={selected_announcement.announcement}
                    is_announce_dialog_open={is_announce_dialog_open}
                    setIsAnnounceDialogOpen={setIsAnnounceDialogOpen}
                    handleOnCancel={handleOnCancel}
                    handleOnConfirm={handleOnConfirm}
                />
            )}
        </div>
    );
};

export default Announcements;
