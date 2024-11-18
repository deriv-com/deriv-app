import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Text } from '@deriv/components';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Notifications as Announcement } from '@deriv-com/ui';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import {
    rudderStackSendAnnouncementActionEvent,
    rudderStackSendAnnouncementClickEvent,
} from '../../../analytics/rudderstack-dashboard';
import { guide_content } from '../../tutorials/constants';
import { performButtonAction } from './utils/accumulator-helper-functions';
import { MessageAnnounce, TitleAnnounce } from './announcement-components';
import AnnouncementDialog from './announcement-dialog';
import { BOT_ANNOUNCEMENTS_LIST, TAnnouncement, TNotifications } from './config';
import './announcements.scss';

type TAnnouncements = {
    is_mobile?: boolean;
    is_tablet?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = observer(({ is_mobile, is_tablet, handleTabChange }: TAnnouncements) => {
    const {
        load_modal: { toggleLoadModal },
        dashboard: { showVideoDialog, setActiveTab },
        quick_strategy: { setFormVisibility },
    } = useDBotStore();
    const [is_announce_dialog_open, setIsAnnounceDialogOpen] = React.useState(false);
    const [is_open_announce_list, setIsOpenAnnounceList] = React.useState(false);
    const [selected_announcement, setSelectedAnnouncement] = React.useState<TAnnouncement | null>(null);
    const [read_announcements_map, setReadAnnouncementsMap] = React.useState({} as Record<string, boolean>);
    const [amount_active_announce, setAmountActiveAnnounce] = React.useState(0);
    const history = useHistory();
    const [notifications, setNotifications] = React.useState([] as TNotifications[]);
    const action_button_class_name = 'announcements__label';

    const storeDataInLocalStorage = (updated_local_storage_data: Record<string, boolean>) => {
        localStorage?.setItem('bot-announcements', JSON.stringify(updated_local_storage_data));
    };

    const updateLocalStorage = (announce_id: string) => {
        let data: Record<string, boolean> | null = null;
        data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');
        storeDataInLocalStorage({ ...data, [announce_id]: false });
        const temp_notifications = updateNotifications();
        setReadAnnouncementsMap(temp_notifications);
    };

    const modalButtonAction = (announce_id: string, announcement: TAnnouncement) => () => {
        setSelectedAnnouncement(announcement);
        setIsAnnounceDialogOpen(true);
        setIsOpenAnnounceList(prev => !prev);
        rudderStackSendAnnouncementClickEvent({ announcement_name: announcement.announcement.main_title });
        updateLocalStorage(announce_id);
    };

    const handleRedirect = (url: string) => () => {
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
                buttonAction: performButtonAction(item, modalButtonAction, handleRedirect),
                actionText: item.actionText,
            });
            temp_localstorage_data[item.id] = is_not_read;
        });
        setNotifications(tmp_notifications);
        return temp_localstorage_data;
    };

    React.useEffect(() => {
        const temp_localstorage_data = updateNotifications();
        storeDataInLocalStorage(temp_localstorage_data);
        setReadAnnouncementsMap(temp_localstorage_data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const number_ammount_active_announce = Object.values(read_announcements_map).filter(value => value).length;
        setAmountActiveAnnounce(number_ammount_active_announce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [read_announcements_map]);

    const openAccumulatorsVideo = () => {
        const accumulators_video = guide_content.find(guide_content => guide_content.id === 4);
        if (accumulators_video) {
            showVideoDialog({ url: accumulators_video.url, type: 'url' });
        }
    };

    const handleOnCancel = () => {
        rudderStackSendAnnouncementActionEvent({
            announcement_name: selected_announcement?.announcement.main_title,
            announcement_action: selected_announcement?.announcement.cancel_button_text,
        });
        if (selected_announcement?.switch_tab_on_cancel) {
            handleTabChange(selected_announcement.switch_tab_on_cancel);
            if (selected_announcement.announcement.id === 'ACCUMULATOR_ANNOUNCE') {
                openAccumulatorsVideo();
            }
        }
        selected_announcement?.onCancel?.();
        setSelectedAnnouncement(null);
    };

    const handleOnConfirm = () => {
        rudderStackSendAnnouncementActionEvent({
            announcement_name: selected_announcement?.announcement.main_title,
            announcement_action: selected_announcement?.announcement.confirm_button_text,
        });
        if (selected_announcement?.switch_tab_on_confirm) {
            handleTabChange(selected_announcement.switch_tab_on_confirm);
        }
        if (selected_announcement?.should_toggle_modal) {
            if (selected_announcement?.announcement.id === 'UPDATES_QUICK_STRATEGY_MODAL_ANNOUNCE') {
                setFormVisibility(true);
            } else {
                toggleLoadModal();
            }
        }
        selected_announcement?.onConfirm?.();
        setSelectedAnnouncement(null);
    };

    const clearNotificationsCallback = () => {
        const temp_read_announcements_map = Object.fromEntries(
            Object.keys(read_announcements_map).map(key => [key, false])
        );
        storeDataInLocalStorage(temp_read_announcements_map);
        const temp_notifications = updateNotifications();
        setReadAnnouncementsMap(temp_notifications);
    };

    return (
        <div className='announcements'>
            <button
                className='announcements__button'
                onClick={() => {
                    setIsOpenAnnounceList(prevState => !prevState);
                    if (!is_open_announce_list) {
                        rudderStackSendOpenEvent({
                            subform_name: 'announcements',
                            subform_source: 'dashboard',
                        });
                    }
                }}
                data-testid='btn-announcements'
            >
                <StandaloneBullhornRegularIcon fill='var(--icon-black-plus)' iconSize='sm' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className={action_button_class_name}>
                        {localize('Announcements')}
                    </Text>
                )}
                {amount_active_announce !== 0 && (
                    <div className='announcements__amount'>
                        <p data-testid='announcements__amount'>{amount_active_announce}</p>
                    </div>
                )}
            </button>
            <div className='notifications__wrapper'>
                <Announcement
                    className={classNames('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                        'notifications__wrapper--tablet': is_tablet,
                    })}
                    clearNotificationsCallback={clearNotificationsCallback}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcements'),
                        noNotificationsMessage: '',
                        noNotificationsTitle: '',
                    }}
                    isOpen={is_open_announce_list}
                    setIsOpen={setIsOpenAnnounceList}
                    notifications={notifications}
                    excludedClickOutsideClass={action_button_class_name}
                    {...(is_mobile && { appElement: document.getElementById('modal_root') })}
                />
            </div>
            {selected_announcement?.announcement && (
                <AnnouncementDialog
                    announcement={selected_announcement.announcement}
                    is_announce_dialog_open={is_announce_dialog_open}
                    setIsAnnounceDialogOpen={setIsAnnounceDialogOpen}
                    handleOnCancel={!selected_announcement?.should_not_be_cancel ? handleOnCancel : null}
                    handleOnConfirm={handleOnConfirm}
                    is_tablet={is_tablet}
                />
            )}
        </div>
    );
});

export default Announcements;
